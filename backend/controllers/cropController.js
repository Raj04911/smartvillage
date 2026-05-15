const axios = require("axios");
const Crop = require("../models/Crop");
const Notification = require("../models/Notification");

const fallbackStateDistrictMap = {
  Bihar: ["Purnia", "Muzaffarpur", "Bhagalpur", "Gaya"],
  Gujarat: ["Rajkot", "Surat", "Ahmedabad", "Vadodara"],
  Karnataka: ["Kolar", "Mysuru", "Belagavi", "Bengaluru Rural"],
  Maharashtra: ["Nashik", "Kolhapur", "Pune", "Nagpur"],
  Punjab: ["Ludhiana", "Amritsar", "Patiala", "Bathinda"],
  Uttar_Pradesh: ["Meerut", "Kanpur", "Varanasi", "Prayagraj"],
  West_Bengal: ["Hooghly", "Malda", "Murshidabad", "Howrah"]
};

const normalizedFallbackStateDistrictMap = Object.fromEntries(
  Object.entries(fallbackStateDistrictMap).map(([state, districts]) => [
    state.replace(/_/g, " "),
    districts
  ])
);

const fallbackCategories = ["Cereeal", "Vegetable", "Cash Crop", "Fiber", "Pulse"];
const fallbackSeasons = ["Kharif", "Rabi", "Summer", "Annual", "Year-round"];

const average = (values = []) => {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const getVolatility = (values = []) => {
  if (values.length < 2) {
    return 0;
  }

  let totalMovement = 0;

  for (let index = 1; index < values.length; index += 1) {
    totalMovement += Math.abs(values[index] - values[index - 1]);
  }

  return Number((totalMovement / (values.length - 1)).toFixed(2));
};

const getDirectionLabel = (value) => {
  if (value >= 5) {
    return "surging";
  }

  if (value >= 1) {
    return "rising";
  }

  if (value <= -5) {
    return "falling sharply";
  }

  if (value < 0) {
    return "cooling";
  }

  return "stable";
};

const getRiskLevel = (volatility, stock) => {
  if (volatility >= 4 || stock < 120) {
    return "High";
  }

  if (volatility >= 2 || stock < 250) {
    return "Medium";
  }

  return "Low";
};

const buildMarketContext = async (crop) => {
  const districtCrops = await Crop.find(
    {
      state: crop.state,
      district: crop.district
    },
    "name price priceHistory demandLevel demandHistory trend stock aiScore"
  );

  const peerCrops = await Crop.find(
    {
      state: crop.state,
      category: crop.category,
      _id: { $ne: crop._id }
    },
    "name district price priceHistory demandLevel demandHistory trend stock aiScore"
  ).limit(5);

  const districtAveragePrice = Number(
    average(districtCrops.map((item) => item.price)).toFixed(2)
  );
  const districtAverageDemand = Number(
    average(districtCrops.map((item) => average(item.demandHistory))).toFixed(2)
  );
  const priceMomentum = Number((crop.price - average(crop.priceHistory)).toFixed(2));
  const volatility = getVolatility(crop.priceHistory);

  return {
    districtAveragePrice,
    districtAverageDemand,
    priceMomentum,
    volatility,
    priceDirection: getDirectionLabel(priceMomentum),
    riskLevel: getRiskLevel(volatility, crop.stock),
    districtCompetition: districtCrops.length,
    peerBenchmarks: peerCrops.map((item) => ({
      name: item.name,
      district: item.district,
      price: item.price,
      trend: item.trend,
      aiScore: item.aiScore,
      demandLevel: item.demandLevel
    }))
  };
};

const normalizePrediction = (crop, rawPrediction, context, source) => {
  const predictedPrice = Number(rawPrediction.predictedPrice || crop.price);
  const priceGap = Number((predictedPrice - crop.price).toFixed(2));

  return {
    source,
    summary: rawPrediction.summary,
    predictedPrice,
    confidence: Math.max(0, Math.min(100, Number(rawPrediction.confidence || 0))),
    recommendedAction: rawPrediction.recommendedAction,
    outlook: rawPrediction.outlook || getDirectionLabel(priceGap),
    riskLevel: rawPrediction.riskLevel || context.riskLevel,
    bestWindow: rawPrediction.bestWindow || "Next 5-7 days",
    marketNarrative:
      rawPrediction.marketNarrative ||
      `Market pulse: ${crop.name} is ${context.priceDirection} in ${crop.district}.\nDemand benchmark: ${context.districtAverageDemand}.\nVolatility watch: ${context.volatility}.`,
    actionSteps: rawPrediction.actionSteps || [],
    priceGap,
    benchmarkPrice: context.districtAveragePrice,
    benchmarkDemand: context.districtAverageDemand,
    volatility: context.volatility
  };
};

const getHeuristicPrediction = async (crop) => {
  const context = await buildMarketContext(crop);
  const avgPrice = average(crop.priceHistory);
  const avgDemand = average(crop.demandHistory);
  const predictedPrice = Number(
    (
      crop.price +
      context.priceMomentum * 0.55 +
      (avgDemand - 65) * 0.04 -
      context.volatility * 0.1
    ).toFixed(2)
  );
  const direction = predictedPrice >= crop.price ? "rise" : "drop";

  return normalizePrediction(
    crop,
    {
      summary: `${crop.name} in ${crop.district}, ${crop.state} is ${context.priceDirection} against a district benchmark of Rs ${context.districtAveragePrice}/kg, while demand remains ${crop.demandLevel.toLowerCase()}. A ${direction} is more likely than a flat market over the next week.`,
      predictedPrice,
      confidence: Math.min(92, Math.max(64, Math.round((avgDemand || crop.aiScore || 70)))),
      recommendedAction:
        direction === "rise"
          ? "Hold a portion of stock and release in batches while prices stay ahead of the district average."
          : "Move inventory faster, especially if storage cost is high or quality degrades quickly.",
      outlook: direction === "rise" ? "bullish" : "softening",
      riskLevel: context.riskLevel,
      bestWindow: direction === "rise" ? "48-96 hours" : "Immediate dispatch",
      marketNarrative: [
        `Market pulse: ${crop.name} in ${crop.district} is ${context.priceDirection}.`,
        `District benchmark: Rs ${context.districtAveragePrice}/kg with demand index ${context.districtAverageDemand}.`,
        `Risk watch: ${context.riskLevel} risk because volatility is ${context.volatility} and stock is ${crop.stock} ${crop.unit}.`
      ].join("\n"),
      actionSteps:
        direction === "rise"
          ? [
              "Release inventory in smaller lots.",
              "Track the next mandi session before discounting.",
              "Use the stronger district benchmark as your negotiation floor."
            ]
          : [
              "Sell sooner while quality is fresh.",
              "Avoid over-holding the crop this week.",
              "Bundle with faster-moving crops if needed."
            ]
    },
    context,
    "heuristic"
  );
};

const tryParseJson = (content) => {
  if (!content) {
    return null;
  }

  const normalizedContent =
    typeof content === "string"
      ? content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "")
      : "";

  try {
    return JSON.parse(normalizedContent);
  } catch (error) {
    const match = normalizedContent.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch (innerError) {
      return null;
    }
  }
};

const getModelCandidates = () => {
  const configuredModel = (process.env.OPENROUTER_MODEL || "").trim();

  if (!configuredModel) {
    return [];
  }

  const normalizedCandidates = [
    configuredModel,
    configuredModel.replace(/:free$/i, ""),
    configuredModel.replace(/:free$/i, ":online"),
    "deepseek/deepseek-chat-v3-0324",
    "openai/gpt-4o-mini"
  ].filter(Boolean);

  return [...new Set(normalizedCandidates)];
};

const getOpenRouterPrediction = async (crop) => {
  if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_MODEL) {
    return null;
  }

  const context = await buildMarketContext(crop);
  const modelCandidates = getModelCandidates();

  for (const modelName of modelCandidates) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: modelName,
          temperature: 0.85,
          max_tokens: 700,
          messages: [
            {
              role: "system",
              content:
                "You are a senior agri-market intelligence analyst for Indian district crop markets. Reply with a single valid JSON object only. Do not add markdown, code fences, or extra text. Use exactly these keys: summary, predictedPrice, confidence, recommendedAction, outlook, riskLevel, bestWindow, marketNarrative, actionSteps."
            },
            {
              role: "user",
              content: JSON.stringify({
                snapshotDate: new Date().toISOString(),
                crop: {
                  name: crop.name,
                  category: crop.category,
                  state: crop.state,
                  district: crop.district,
                  currentPrice: crop.price,
                  currentStock: crop.stock,
                  season: crop.season,
                  demandLevel: crop.demandLevel,
                  aiScore: crop.aiScore,
                  trend: crop.trend,
                  priceHistory: crop.priceHistory,
                  demandHistory: crop.demandHistory
                },
                marketContext: context,
                instructions: [
                  "Use realistic short-term outlook for next 7 days.",
                  "Predicted price must be numeric and in rupees per kg.",
                  "Confidence must be 0-100.",
                  "Keep summary under 45 words.",
                  "Recommended action should be practical for a farmer or buyer.",
                  "marketNarrative must be 3 lines separated by newline characters.",
                  "actionSteps must contain exactly 3 concise strings.",
                  "If you are uncertain, still return best-effort valid JSON with realistic values."
                ]
              })
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
            "X-Title": process.env.OPENROUTER_APP_NAME || "Smart Dashboard System"
          },
          timeout: 15000
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      const resolvedContent = Array.isArray(content)
        ? content
            .map((item) => item?.text || item?.content || "")
            .join("")
            .trim()
        : content;

      if (!resolvedContent) {
        continue;
      }

      const parsed = tryParseJson(resolvedContent);

      if (!parsed) {
        console.error("OpenRouter returned non-JSON prediction content:", resolvedContent);
        continue;
      }

      return normalizePrediction(crop, parsed, context, "openrouter");
    } catch (error) {
      console.error(
        `OpenRouter prediction failed for model ${modelName}:`,
        error.response?.status,
        error.response?.data || error.message
      );
    }
  }

  return null;
};

exports.createCrop = async (req, res) => {
  try {
    const crop = await Crop.create(req.body);

    await Notification.create({
      audience: "admin",
      userId: null,
      title: "New crop listed",
      message: `${crop.name} was added for ${crop.district}, ${crop.state}.`,
      type: "crop"
    });

    res.status(201).json({
      success: true,
      crop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCrops = async (req, res) => {
  try {
    const { state, district, category, season, search } = req.query;
    const query = {};

    if (state) {
      query.state = new RegExp(`^${state}$`, "i");
    }

    if (district) {
      query.district = new RegExp(`^${district}$`, "i");
    }

    if (category) {
      query.category = new RegExp(`^${category}$`, "i");
    }

    if (season) {
      query.season = new RegExp(`^${season}$`, "i");
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { district: new RegExp(search, "i") },
        { state: new RegExp(search, "i") }
      ];
    }

    const crops = await Crop.find(query).sort({ aiScore: -1, price: 1 });

    res.status(200).json({
      success: true,
      crops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCropFilters = async (req, res) => {
  try {
    const crops = await Crop.find({}, "state district category season");
    const states = [...new Set(crops.map((crop) => crop.state).filter(Boolean))].sort();
    const districts = [...new Set(crops.map((crop) => crop.district).filter(Boolean))].sort();
    const categories = [...new Set(crops.map((crop) => crop.category).filter(Boolean))].sort();
    const seasons = [...new Set(crops.map((crop) => crop.season).filter(Boolean))].sort();
    const stateDistrictMap = crops.reduce((acc, crop) => {
      if (!crop.state || !crop.district) {
        return acc;
      }

      if (!acc[crop.state]) {
        acc[crop.state] = [];
      }

      if (!acc[crop.state].includes(crop.district)) {
        acc[crop.state].push(crop.district);
      }

      acc[crop.state].sort();
      return acc;
    }, {});

    const mergedStateDistrictMap = {
      ...normalizedFallbackStateDistrictMap
    };

    Object.entries(stateDistrictMap).forEach(([state, stateDistricts]) => {
      mergedStateDistrictMap[state] = [
        ...new Set([...(mergedStateDistrictMap[state] || []), ...stateDistricts])
      ].sort();
    });

    const resolvedStateDistrictMap = mergedStateDistrictMap;
    const resolvedStates = [
      ...new Set([...Object.keys(normalizedFallbackStateDistrictMap), ...states])
    ].sort();
    const resolvedDistricts = [
      ...new Set([
        ...Object.values(normalizedFallbackStateDistrictMap).flat(),
        ...districts
      ])
    ].sort();
    const resolvedCategories = [...new Set([...fallbackCategories, ...categories])].sort();
    const resolvedSeasons = [...new Set([...fallbackSeasons, ...seasons])].sort();

    res.status(200).json({
      success: true,
      filters: {
        states: resolvedStates,
        districts: resolvedDistricts,
        categories: resolvedCategories,
        seasons: resolvedSeasons,
        stateDistrictMap: resolvedStateDistrictMap
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDistrictRecommendations = async (req, res) => {
  try {
    const { state, district } = req.query;
    const query = {};

    if (state) {
      query.state = new RegExp(`^${state}$`, "i");
    }

    if (district) {
      query.district = new RegExp(`^${district}$`, "i");
    }

    const crops = await Crop.find(query).sort({ aiScore: -1, trend: -1 }).limit(6);
    const recommendations = crops.map((crop) => ({
      _id: crop._id,
      name: crop.name,
      district: crop.district,
      state: crop.state,
      demandLevel: crop.demandLevel,
      season: crop.season,
      price: crop.price,
      aiScore: crop.aiScore,
      reason: `${crop.name} is ${getDirectionLabel(crop.trend)} in ${crop.district}, with ${crop.demandLevel.toLowerCase()} demand and a strong suitability score for this district.`
    }));

    res.status(200).json({
      success: true,
      recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPriceInsights = async (req, res) => {
  try {
    const crops = await Crop.find().sort({ updatedAt: -1 });

    const insights = crops.map((crop) => {
      const avgPrice = average(crop.priceHistory);
      const forecast = Number(
        (
          crop.price +
          (crop.price - avgPrice) * 0.35 +
          (average(crop.demandHistory) - 65) * 0.05
        ).toFixed(2)
      );
      const change = Number((forecast - crop.price).toFixed(2));
      const volatility = getVolatility(crop.priceHistory);

      return {
        _id: crop._id,
        crop: crop.name,
        state: crop.state,
        district: crop.district,
        currentPrice: crop.price,
        predictedPrice: forecast,
        volatility,
        change,
        demandLevel: crop.demandLevel,
        trend: crop.trend,
        history: crop.priceHistory,
        outlook: getDirectionLabel(change),
        opportunityScore: Math.round(crop.aiScore * 0.7 + Math.max(change, 0) * 4)
      };
    });

    res.status(200).json({
      success: true,
      insights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMarketOverview = async (req, res) => {
  try {
    const crops = await Crop.find().sort({ aiScore: -1, trend: -1 });
    const insights = crops.map((crop) => {
      const avgPrice = average(crop.priceHistory);
      const change = Number(
        (
          crop.price +
          (crop.price - avgPrice) * 0.35 +
          (average(crop.demandHistory) - 65) * 0.05 -
          crop.price
        ).toFixed(2)
      );

      return {
        crop: crop.name,
        district: crop.district,
        state: crop.state,
        demandLevel: crop.demandLevel,
        change,
        aiScore: crop.aiScore,
        trend: crop.trend
      };
    });

    const bestOpportunity = [...insights].sort(
      (left, right) => right.aiScore + right.change * 5 - (left.aiScore + left.change * 5)
    )[0];
    const highestRisk = [...crops]
      .map((crop) => ({
        crop: crop.name,
        district: crop.district,
        state: crop.state,
        riskLevel: getRiskLevel(getVolatility(crop.priceHistory), crop.stock),
        volatility: getVolatility(crop.priceHistory)
      }))
      .sort((left, right) => right.volatility - left.volatility)[0];

    const demandHotspots = Object.values(
      crops.reduce((acc, crop) => {
        const key = `${crop.district}, ${crop.state}`;
        if (!acc[key]) {
          acc[key] = {
            label: key,
            score: 0
          };
        }

        acc[key].score += crop.aiScore;
        return acc;
      }, {})
    )
      .sort((left, right) => right.score - left.score)
      .slice(0, 3);

    res.status(200).json({
      success: true,
      overview: {
        bestOpportunity,
        highestRisk,
        demandHotspots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPrediction = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.cropId);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found"
      });
    }

    if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_MODEL) {
      return res.status(503).json({
        success: false,
        aiConnected: false,
        message: "AI not connected. Please configure the OpenRouter API."
      });
    }

    const aiPrediction = await getOpenRouterPrediction(crop);

    if (!aiPrediction) {
      return res.status(502).json({
        success: false,
        aiConnected: false,
        message: "AI not connected or the OpenRouter model/key is invalid."
      });
    }

    res.status(200).json({
      success: true,
      aiConnected: true,
      prediction: aiPrediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
