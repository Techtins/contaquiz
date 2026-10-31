package br.com.techtins.contaquiz.dto.history;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record HistoryAnalyticsResponse(
    @JsonProperty("timeline") List<HistoryTimelineItemResponse> timeline,
    @JsonProperty("byDiscipline") List<HistoryBreakdownItemResponse> byDiscipline,
    @JsonProperty("byTopic") List<HistoryBreakdownItemResponse> byTopic,
    @JsonProperty("byDifficulty") List<HistoryDifficultyItemResponse> byDifficulty,
    @JsonProperty("comparison") List<HistoryComparisonGroupResponse> comparison,
    @JsonProperty("lowAreas") List<HistoryLowAreaItemResponse> lowAreas
) {
}
