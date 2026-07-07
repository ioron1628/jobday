class KoreanReporter {
  onBegin(_, suite) {
    this.total = suite.allTests().length;
    this.failed = 0;
    console.log(`\nJOBDAY 자동 검수를 시작합니다. 총 ${this.total}개 항목을 확인합니다.\n`);
  }

  onTestEnd(test, result) {
    const title = test.titlePath().filter(Boolean).slice(1).join(" > ");

    if (result.status === "passed") {
      console.log(`- ${title}: 전체 성공`);
      return;
    }

    if (result.status === "skipped") {
      console.log(`- ${title}: 건너뜀`);
      return;
    }

    this.failed += 1;
    const message = result.error?.message?.split("\n")[0] ?? "알 수 없는 오류";
    console.log(`- ${title}: 실패, 이유: ${message}`);
  }

  onStepEnd(_, __, step) {
    if (step.category !== "test.step") return;

    if (step.error) {
      const message = step.error.message?.split("\n")[0] ?? "알 수 없는 오류";
      console.log(`  - ${step.title}: 실패, 이유: ${message}`);
      return;
    }

    console.log(`  - ${step.title}: 성공`);
  }

  onEnd(result) {
    const passed = Math.max((this.total ?? 0) - (this.failed ?? 0), 0);
    const status = result.status === "passed" ? "전체 성공" : "확인 필요";
    console.log(`\nJOBDAY 자동 검수 결과: ${status}`);
    console.log(`성공 ${passed}개 / 실패 ${this.failed ?? 0}개\n`);
  }
}

module.exports = KoreanReporter;
