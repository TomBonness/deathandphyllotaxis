import { 
  getContinuedFraction, 
  getConvergents, 
  getDivergenceRatio, 
  calculatePackingEfficiency, 
  getSpaceUtilizationFeedback 
} from '../utils/math';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${message}`);
    process.exit(1);
  }
}

console.log("=== Running Math Verification Tests ===");

// 1. Test Divergence Ratio
const goldenRatio = getDivergenceRatio(137.508);
console.log(`Golden Angle Divergence Ratio: ${goldenRatio.toFixed(6)}`);
assert(Math.abs(goldenRatio - 0.381966) < 0.0001, "Golden Angle divergence ratio should be close to 0.381966");

// 2. Test Continued Fraction for Golden Angle
const goldenTerms = getContinuedFraction(goldenRatio, 8);
console.log("Golden Angle Continued Fraction terms:", goldenTerms);
// For Golden Angle, the terms should be [2, 1, 1, 1, 1, 1, 1, 1]
assert(goldenTerms.length >= 6, "Should return at least 6 terms");
assert(goldenTerms[0] === 2, "First term of Golden Angle should be 2");
for (let i = 1; i < 6; i++) {
  assert(goldenTerms[i] === 1, `Term at index ${i} should be 1 for Golden Ratio, got ${goldenTerms[i]}`);
}
console.log("✅ Continued fraction terms for Golden Angle are correct.");

// 3. Test Continued Fraction for Rational Angle 135° (ratio 3/8)
const rationalRatio = getDivergenceRatio(135.000);
const rationalTerms = getContinuedFraction(rationalRatio, 8);
console.log("Rational Angle 135° Continued Fraction terms:", rationalTerms);
// 135 / 360 = 3/8. Continued fraction of 3/8:
// 3/8 = 1 / (8/3) = 1 / (2 + 2/3) -> a1 = 2
// Remainder = 2/3. 1 / (2/3) = 3/2 = 1 + 1/2 -> a2 = 1
// Remainder = 1/2. 1 / (1/2) = 2 -> a3 = 2
// Expected terms: [2, 1, 2]
assert(rationalTerms[0] === 2 && rationalTerms[1] === 1 && rationalTerms[2] === 2, "135° continued fraction should be [2, 1, 2]");
console.log("✅ Continued fraction terms for 135° are correct.");

// 4. Test Convergents for 135°
const rationalConvergents = getConvergents(rationalTerms);
console.log("Rational Angle 135° Convergents:", rationalConvergents);
assert(rationalConvergents.some(c => c.p === 3 && c.q === 8), "135° convergents must include 3/8");
console.log("✅ Convergents for 135° are correct.");

// 5. Test Packing Efficiency Calculations
const effGolden = calculatePackingEfficiency(137.508);
const effPi = calculatePackingEfficiency(114.592);
const effRational = calculatePackingEfficiency(135.000);

console.log(`Packing Efficiency of Golden Angle (137.508°): ${effGolden}% (Expected ~99%)`);
console.log(`Packing Efficiency of Pi Angle (114.592°): ${effPi}% (Expected ~45%)`);
console.log(`Packing Efficiency of Rational Angle (135.000°): ${effRational}% (Expected ~10%)`);

assert(Math.abs(effGolden - 99) < 2, "Golden Angle packing efficiency must be ~99%");
assert(Math.abs(effPi - 45) < 2, "Pi Angle packing efficiency must be ~45%");
assert(Math.abs(effRational - 10) < 2, "Rational Angle (135°) packing efficiency must be ~10%");
console.log("✅ Packing efficiency calculations are correct and meet specifications.");

// 6. Test Space Utilization Feedback Text
const feedbackGolden = getSpaceUtilizationFeedback(137.508, effGolden, getConvergents(goldenTerms));
const feedbackRational = getSpaceUtilizationFeedback(135.000, effRational, rationalConvergents);

console.log(`Feedback for Golden Angle: "${feedbackGolden}"`);
console.log(`Feedback for 135°: "${feedbackRational}"`);

assert(feedbackGolden.includes("Optimal packing") && feedbackGolden.includes("99%"), "Golden angle feedback should be positive and descriptive");
assert(feedbackRational.includes("Severe clumping") && feedbackRational.includes("135°") && feedbackRational.includes("8 spokes") && feedbackRational.includes("88%"), "135° feedback must match specified biological impact");
console.log("✅ Space utilization feedback texts are correct.");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
