import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GroupExplanation {
    group: string;
    shap_sum: number;
    abs_shap_sum: number;
    percent: number;
}

interface CumulativeExplanation {
    feature: string;
    shap: number;
    from: number;
    to: number;
    direction: 'Increase' | 'Decrease';
    percent: number;
}

interface TranslationStrings {
    predictionScore: string;
    riskLevel: string;
    topFactors: string;
    allFactors: string;
    showMore: string;
    showLess: string;
    increases: string;
    decreases: string;
    contribution: string;
    fromValue: string;
    toValue: string;
    baseline: string;
    finalPrediction: string;
    groupContributions: string;
    featureContributions: string;
    impact: string;
    value: string;
    change: string;
}

// ============================================================================
// COMPONENT 1: SHAP CONTRIBUTION CARDS (MOST RECOMMENDED)
// ============================================================================
// Best for: Mobile devices, Quick scanning, Non-technical users
// Translation: All text in strings object, easy to swap language
// RTL Support: Flex layouts work automatically with dir="rtl"

interface SHAPContributionCardsProps {
    groupExplanations: GroupExplanation[];
    cumulativeExplanations: CumulativeExplanation[];
    baselineScore: number;
    finalScore: number;
    translations: TranslationStrings;
    locale?: 'en' | 'ar';
}

export const SHAPContributionCards: React.FC<SHAPContributionCardsProps> = ({
    groupExplanations,
    cumulativeExplanations,
    baselineScore,
    finalScore,
    translations,
    locale = 'en',
}) => {
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const toggleGroup = (group: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(group)) {
            newExpanded.delete(group);
        } else {
            newExpanded.add(group);
        }
        setExpandedGroups(newExpanded);
    };

    const topFeatures = cumulativeExplanations
        .sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap))
        .slice(0, 5);

    const displayFeatures = showAllFeatures ? cumulativeExplanations : topFeatures;

    const getImpactColor = (shap: number) => {
        if (shap > 0) return 'text-red-600 bg-red-50 border-red-200';
        return 'text-blue-600 bg-blue-50 border-blue-200';
    };

    const getRiskColor = (score: number) => {
        if (score < 30) return 'text-green-600';
        if (score < 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header Card - Overall Prediction */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="text-2xl">{translations.predictionScore}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={`text-5xl font-bold ${getRiskColor(finalScore)}`}>
                                {finalScore.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{translations.riskLevel}</div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                            <div>{translations.baseline}: {baselineScore.toFixed(1)}</div>
                            <div className="flex items-center gap-2 mt-1">
                                {finalScore > baselineScore ? (
                                    <TrendingUp className="w-4 h-4 text-red-500" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-blue-500" />
                                )}
                                <span>
                                    {Math.abs(finalScore - baselineScore).toFixed(1)} {translations.change}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Group Level Contributions */}
            <Card>
                <CardHeader>
                    <CardTitle>{translations.groupContributions}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {groupExplanations
                        .sort((a, b) => Math.abs(b.shap_sum) - Math.abs(a.shap_sum))
                        .map((group) => {
                            const isExpanded = expandedGroups.has(group.group);
                            const groupFeatures = cumulativeExplanations.filter((f) =>
                                f.feature.toLowerCase().includes(group.group.toLowerCase())
                            );

                            return (
                                <div key={group.group} className="border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleGroup(group.group)}
                                        className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${getImpactColor(
                                            group.shap_sum
                                        )} border`}
                                    >
                                        <div className="flex-1">
                                            <div className="font-semibold text-lg">{group.group}</div>
                                            <div className="text-sm opacity-75 mt-1">
                                                {group.percent.toFixed(1)}% {translations.contribution}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="font-bold text-xl">
                                                    {group.shap_sum > 0 ? '+' : ''}
                                                    {group.shap_sum.toFixed(2)}
                                                </div>
                                                <div className="text-xs opacity-75">
                                                    {group.shap_sum > 0 ? translations.increases : translations.decreases}
                                                </div>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </div>
                                    </button>

                                    {isExpanded && groupFeatures.length > 0 && (
                                        <div className="bg-white p-4 space-y-2 border-t">
                                            {groupFeatures.map((feature, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-medium">{feature.feature}</div>
                                                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                            <span>{feature.from.toFixed(2)}</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                            <span className="font-semibold">{feature.to.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`text-right px-3 py-1 rounded ${feature.shap > 0 ? 'bg-red-100' : 'bg-blue-100'
                                                            }`}
                                                    >
                                                        <div className="font-bold">
                                                            {feature.shap > 0 ? '+' : ''}
                                                            {feature.shap.toFixed(2)}
                                                        </div>
                                                        <div className="text-xs">{feature.percent.toFixed(1)}%</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </CardContent>
            </Card>

            {/* Individual Feature Contributions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{translations.topFactors}</span>
                        <button
                            onClick={() => setShowAllFeatures(!showAllFeatures)}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            {showAllFeatures ? translations.showLess : translations.showMore}
                        </button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {displayFeatures.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`p-4 rounded-lg border-l-4 ${feature.shap > 0 ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500 bg-blue-50'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="font-semibold text-lg">{feature.feature}</div>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                                        <span className="bg-white px-2 py-1 rounded">
                                            {translations.fromValue}: {feature.from.toFixed(2)}
                                        </span>
                                        <ArrowRight className="w-4 h-4" />
                                        <span className="bg-white px-2 py-1 rounded font-semibold">
                                            {translations.toValue}: {feature.to.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <div
                                        className={`text-2xl font-bold ${feature.shap > 0 ? 'text-red-600' : 'text-blue-600'
                                            }`}
                                    >
                                        {feature.shap > 0 ? '+' : ''}
                                        {feature.shap.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600">{feature.percent.toFixed(1)}%</div>
                                    <div className="text-xs mt-1">
                                        {feature.shap > 0 ? (
                                            <span className="flex items-center gap-1 text-red-600">
                                                <TrendingUp className="w-3 h-3" />
                                                {translations.increases}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-blue-600">
                                                <TrendingDown className="w-3 h-3" />
                                                {translations.decreases}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

// ============================================================================
// COMPONENT 2: SHAP FORCE PLOT (PUSH-PULL VISUALIZATION)
// ============================================================================
// Best for: Visual learners, Understanding directional impact
// Translation: Minimal text, visual metaphor is universal
// RTL Support: Mirrored layout for RTL languages

interface SHAPForcePlotProps {
    cumulativeExplanations: CumulativeExplanation[];
    baselineScore: number;
    finalScore: number;
    translations: TranslationStrings;
    locale?: 'en' | 'ar';
}

export const SHAPForcePlot: React.FC<SHAPForcePlotProps> = ({
    cumulativeExplanations,
    baselineScore,
    finalScore,
    translations,
    locale = 'en',
}) => {
    const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

    const sortedFeatures = [...cumulativeExplanations].sort(
        (a, b) => Math.abs(b.shap) - Math.abs(a.shap)
    );

    const maxAbsShap = Math.max(...sortedFeatures.map((f) => Math.abs(f.shap)));
    const increasingFactors = sortedFeatures.filter((f) => f.shap > 0);
    const decreasingFactors = sortedFeatures.filter((f) => f.shap < 0);

    const getBarWidth = (shap: number) => {
        return (Math.abs(shap) / maxAbsShap) * 100;
    };

    const isRTL = locale === 'ar';

    return (
        <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <Card>
                <CardHeader>
                    <CardTitle>{translations.featureContributions}</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Baseline and Final Score Markers */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <div className="text-center">
                            <div className="text-sm text-gray-500">{translations.baseline}</div>
                            <div className="text-3xl font-bold text-gray-700">{baselineScore.toFixed(1)}</div>
                        </div>
                        <div className="flex-1 mx-8">
                            <div className="relative h-2 bg-gray-200 rounded-full">
                                <div
                                    className="absolute h-2 bg-linear-to-r from-blue-500 to-red-500 rounded-full"
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500">{translations.finalPrediction}</div>
                            <div className="text-3xl font-bold text-purple-600">{finalScore.toFixed(1)}</div>
                        </div>
                    </div>

                    {/* Force Plot Visualization */}
                    <div className="space-y-8">
                        {/* Increasing Factors (Pushing Right/Up) */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-5 h-5 text-red-600" />
                                <h6 className="font-semibold text-red-600">{translations.increases}</h6>
                                <span className="text-sm text-gray-500">
                                    ({increasingFactors.length} {translations.allFactors})
                                </span>
                            </div>
                            <div className="space-y-2">
                                {increasingFactors.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="relative"
                                        onMouseEnter={() => setHoveredFeature(feature.feature)}
                                        onMouseLeave={() => setHoveredFeature(null)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 text-sm font-medium truncate text-right">
                                                {feature.feature}
                                            </div>
                                            <div className="flex-1 flex items-center">
                                                <div
                                                    className="h-8 bg-linear-to-r from-red-400 to-red-600 rounded-r transition-all duration-300 hover:shadow-lg"
                                                    style={{
                                                        width: `${getBarWidth(feature.shap)}%`,
                                                        transform: isRTL ? 'scaleX(-1)' : 'none',
                                                    }}
                                                />
                                                <div className="ml-3 font-bold text-red-600">
                                                    +{feature.shap.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        {hoveredFeature === feature.feature && (
                                            <div className="absolute z-10 left-0 right-0 top-10 bg-white border-2 border-red-200 rounded-lg p-3 shadow-xl">
                                                <div className="text-sm space-y-1">
                                                    <div className="font-semibold">{feature.feature}</div>
                                                    <div className="text-gray-600">
                                                        {translations.fromValue}: {feature.from.toFixed(2)} → {translations.toValue}: {feature.to.toFixed(2)}
                                                    </div>
                                                    <div className="text-red-600 font-bold">
                                                        {translations.impact}: +{feature.shap.toFixed(2)} ({feature.percent.toFixed(1)}%)
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Decreasing Factors (Pushing Left/Down) */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingDown className="w-5 h-5 text-blue-600" />
                                <h6 className="font-semibold text-blue-600">{translations.decreases}</h6>
                                <span className="text-sm text-gray-500">
                                    ({decreasingFactors.length} {translations.allFactors})
                                </span>
                            </div>
                            <div className="space-y-2">
                                {decreasingFactors.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="relative"
                                        onMouseEnter={() => setHoveredFeature(feature.feature)}
                                        onMouseLeave={() => setHoveredFeature(null)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 text-sm font-medium truncate text-right">
                                                {feature.feature}
                                            </div>
                                            <div className="flex-1 flex items-center">
                                                <div
                                                    className="h-8 bg-linear-to-r from-blue-400 to-blue-600 rounded-r transition-all duration-300 hover:shadow-lg"
                                                    style={{
                                                        width: `${getBarWidth(feature.shap)}%`,
                                                        transform: isRTL ? 'scaleX(-1)' : 'none',
                                                    }}
                                                />
                                                <div className="ml-3 font-bold text-blue-600">
                                                    {feature.shap.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        {hoveredFeature === feature.feature && (
                                            <div className="absolute z-10 left-0 right-0 top-10 bg-white border-2 border-blue-200 rounded-lg p-3 shadow-xl">
                                                <div className="text-sm space-y-1">
                                                    <div className="font-semibold">{feature.feature}</div>
                                                    <div className="text-gray-600">
                                                        {translations.fromValue}: {feature.from.toFixed(2)} → {translations.toValue}: {feature.to.toFixed(2)}
                                                    </div>
                                                    <div className="text-blue-600 font-bold">
                                                        {translations.impact}: {feature.shap.toFixed(2)} ({feature.percent.toFixed(1)}%)
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// ============================================================================
// COMPONENT 3: SHAP WATERFALL CHART (SEQUENTIAL FLOW)
// ============================================================================
// Best for: Technical users, Understanding cumulative effects
// Translation: Labels easily replaceable with translation object
// RTL Support: Bars can flip direction for RTL

interface SHAPWaterfallChartProps {
    cumulativeExplanations: CumulativeExplanation[];
    baselineScore: number;
    finalScore: number;
    translations: TranslationStrings;
    locale?: 'en' | 'ar';
}

export const SHAPWaterfallChart: React.FC<SHAPWaterfallChartProps> = ({
    cumulativeExplanations,
    baselineScore,
    finalScore,
    translations,
    locale = 'en',
}) => {
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

    // Sort by SHAP magnitude for waterfall effect
    const sortedFeatures = [...cumulativeExplanations].sort(
        (a, b) => Math.abs(b.shap) - Math.abs(a.shap)
    );

    // Calculate cumulative scores for waterfall
    let cumulativeScore = baselineScore;
    const waterfallData = sortedFeatures.map((feature) => {
        const previousScore = cumulativeScore;
        // eslint-disable-next-line react-hooks/immutability
        cumulativeScore += feature.shap;
        return {
            ...feature,
            startScore: previousScore,
            endScore: cumulativeScore,
        };
    });

    const minScore = Math.min(baselineScore, finalScore, ...waterfallData.map((d) => d.startScore));
    const maxScore = Math.max(baselineScore, finalScore, ...waterfallData.map((d) => d.endScore));
    const scoreRange = maxScore - minScore;

    const getYPosition = (score: number) => {
        return ((maxScore - score) / scoreRange) * 100;
    };

    const getBarHeight = (shap: number) => {
        return (Math.abs(shap) / scoreRange) * 100;
    };

    const isRTL = locale === 'ar';

    return (
        <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <Card>
                <CardHeader>
                    <CardTitle>{translations.featureContributions}</CardTitle>
                    <p className="text-sm text-gray-500 mt-2">
                        {translations.baseline}: {baselineScore.toFixed(1)} → {translations.finalPrediction}:{' '}
                        {finalScore.toFixed(1)}
                    </p>
                </CardHeader>
                <CardContent>
                    {/* Chart Container */}
                    <div className="relative h-96 bg-gray-50 rounded-lg p-6">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
                            <span>{maxScore.toFixed(0)}</span>
                            <span>{((maxScore + minScore) / 2).toFixed(0)}</span>
                            <span>{minScore.toFixed(0)}</span>
                        </div>

                        {/* Chart area */}
                        <div className="ml-20 h-full flex items-end gap-2">
                            {/* Baseline bar */}
                            <div className="flex-1 flex flex-col items-center justify-end">
                                <div className="text-xs font-semibold mb-1 text-gray-700">
                                    {baselineScore.toFixed(1)}
                                </div>
                                <div
                                    className="w-full bg-gray-400 rounded-t"
                                    style={{
                                        height: `${((baselineScore - minScore) / scoreRange) * 100}%`,
                                    }}
                                />
                                <div className="text-xs mt-2 text-center font-medium">{translations.baseline}</div>
                            </div>

                            {/* Feature bars */}
                            {waterfallData.map((data, idx) => {
                                const isPositive = data.shap > 0;
                                const barHeight = getBarHeight(data.shap);
                                const bottomOffset = getYPosition(data.startScore);

                                return (
                                    <div
                                        key={idx}
                                        className="flex-1 relative cursor-pointer group"
                                        onClick={() =>
                                            setSelectedFeature(selectedFeature === data.feature ? null : data.feature)
                                        }
                                    >
                                        {/* Connecting line from previous */}
                                        <div
                                            className="absolute w-full border-t-2 border-dashed border-gray-300"
                                            style={{
                                                bottom: `${100 - bottomOffset}%`,
                                                left: '-50%',
                                            }}
                                        />

                                        {/* Bar */}
                                        <div className="h-full flex flex-col justify-end">
                                            <div
                                                className={`w-full rounded transition-all duration-200 group-hover:opacity-80 ${isPositive
                                                    ? 'bg-linear-to-t from-red-500 to-red-400'
                                                    : 'bg-linear-to-t from-blue-500 to-blue-400'
                                                    }`}
                                                style={{
                                                    height: `${barHeight}%`,
                                                    marginBottom: `${100 - bottomOffset - barHeight}%`,
                                                }}
                                            >
                                                {/* Value label */}
                                                <div className="text-xs font-bold text-white text-center py-1">
                                                    {isPositive ? '+' : ''}
                                                    {data.shap.toFixed(1)}
                                                </div>
                                            </div>

                                            {/* Feature name */}
                                            <div className="text-xs mt-2 text-center truncate font-medium max-w-full">
                                                {data.feature.split('_').slice(0, 2).join(' ')}
                                            </div>
                                        </div>

                                        {/* Hover tooltip */}
                                        {selectedFeature === data.feature && (
                                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-20 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-xl w-64">
                                                <div className="text-sm space-y-2">
                                                    <div className="font-bold">{data.feature}</div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <div className="text-gray-500">{translations.fromValue}</div>
                                                            <div className="font-semibold">{data.from.toFixed(2)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500">{translations.toValue}</div>
                                                            <div className="font-semibold">{data.to.toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="pt-2 border-t">
                                                        <div className="text-gray-500">{translations.impact}</div>
                                                        <div className={`font-bold text-lg ${isPositive ? 'text-red-600' : 'text-blue-600'}`}>
                                                            {isPositive ? '+' : ''}
                                                            {data.shap.toFixed(2)} ({data.percent.toFixed(1)}%)
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Final prediction bar */}
                            <div className="flex-1 flex flex-col items-center justify-end">
                                <div className="text-xs font-semibold mb-1 text-purple-700">
                                    {finalScore.toFixed(1)}
                                </div>
                                <div
                                    className="w-full bg-linear-to-t from-purple-600 to-purple-400 rounded-t"
                                    style={{
                                        height: `${((finalScore - minScore) / scoreRange) * 100}%`,
                                    }}
                                />
                                <div className="text-xs mt-2 text-center font-medium">
                                    {translations.finalPrediction}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded" />
                            <span>{translations.increases}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded" />
                            <span>{translations.decreases}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// ============================================================================
// EXAMPLE USAGE WITH SAMPLE DATA
// ============================================================================

export const SHAPVisualizationsExample = () => {
    // Sample data from your project
    const groupExplanations: GroupExplanation[] = [
        { group: 'Climate', shap_sum: -4.36, abs_shap_sum: 10.66, percent: 45.65 },
        { group: 'Air Quality', shap_sum: 8.22, abs_shap_sum: 8.22, percent: 35.2 },
        { group: 'Demographics', shap_sum: -2.1, abs_shap_sum: 3.5, percent: 15.0 },
        { group: 'Health Metrics', shap_sum: 1.8, abs_shap_sum: 2.2, percent: 4.15 },
    ];

    const cumulativeExplanations: CumulativeExplanation[] = [
        {
            feature: 'pm25_ugm3',
            shap: -9.04,
            from: 69.65,
            to: 60.61,
            direction: 'Decrease',
            percent: 38.7,
        },
        {
            feature: 'temperature_celsius',
            shap: 5.2,
            from: 28.5,
            to: 33.7,
            direction: 'Increase',
            percent: 22.3,
        },
        {
            feature: 'humidity_percent',
            shap: -3.1,
            from: 65.0,
            to: 45.0,
            direction: 'Decrease',
            percent: 13.3,
        },
        {
            feature: 'no2_ugm3',
            shap: 4.8,
            from: 25.0,
            to: 42.0,
            direction: 'Increase',
            percent: 20.5,
        },
        {
            feature: 'age_years',
            shap: 2.3,
            from: 35.0,
            to: 65.0,
            direction: 'Increase',
            percent: 9.8,
        },
    ];

    const translationsEN: TranslationStrings = {
        predictionScore: 'Health Risk Prediction',
        riskLevel: 'Risk Level',
        topFactors: 'Top Contributing Factors',
        allFactors: 'factors',
        showMore: 'Show All Factors',
        showLess: 'Show Top 5 Only',
        increases: 'Increases Risk',
        decreases: 'Decreases Risk',
        contribution: 'contribution',
        fromValue: 'From',
        toValue: 'To',
        baseline: 'Baseline',
        finalPrediction: 'Final Prediction',
        groupContributions: 'Impact by Category',
        featureContributions: 'Feature Impact Analysis',
        impact: 'Impact',
        value: 'Value',
        change: 'change',
    };

    const translationsAR: TranslationStrings = {
        predictionScore: 'توقع المخاطر الصحية',
        riskLevel: 'مستوى الخطر',
        topFactors: 'أهم العوامل المؤثرة',
        allFactors: 'عوامل',
        showMore: 'عرض كل العوامل',
        showLess: 'عرض أهم 5 فقط',
        increases: 'يزيد الخطر',
        decreases: 'يقلل الخطر',
        contribution: 'مساهمة',
        fromValue: 'من',
        toValue: 'إلى',
        baseline: 'الأساس',
        finalPrediction: 'التوقع النهائي',
        groupContributions: 'التأثير حسب الفئة',
        featureContributions: 'تحليل تأثير العوامل',
        impact: 'التأثير',
        value: 'القيمة',
        change: 'تغيير',
    };

    return (
        <div className="max-w-6xl mx-auto p-2">
            <div>
                <div className="space-y-6">
                    <section>
                        <h6 className="font-semibold mb-4">1. Contribution Cards</h6>
                        <SHAPContributionCards
                            groupExplanations={groupExplanations}
                            cumulativeExplanations={cumulativeExplanations}
                            baselineScore={50.0}
                            finalScore={58.5}
                            translations={translationsEN}
                            locale="en"
                        />
                    </section>

                    <section>
                        <h6 className="font-semibold mb-4">2. Force Plot</h6>
                        <SHAPForcePlot
                            cumulativeExplanations={cumulativeExplanations}
                            baselineScore={50.0}
                            finalScore={58.5}
                            translations={translationsEN}
                            locale="en"
                        />
                    </section>

                    <section>
                        <h6 className="font-semibold mb-4">3. Waterfall Chart</h6>
                        <SHAPWaterfallChart
                            cumulativeExplanations={cumulativeExplanations}
                            baselineScore={50.0}
                            finalScore={58.5}
                            translations={translationsEN}
                            locale="en"
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};