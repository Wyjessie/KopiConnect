import { User } from '@prisma/client';

export interface MatchCriteria {
  proximity: number; // Weight for proximity matching (0-1)
  timeAvailability: number; // Weight for time availability (0-1)
  dietary: number; // Weight for dietary compatibility (0-1)
  budget: number; // Weight for budget compatibility (0-1)
  age: number; // Weight for age compatibility (0-1)
  interests: number; // Weight for common interests (0-1)
}

// Default matching weights
export const DEFAULT_WEIGHTS: MatchCriteria = {
  proximity: 0.25,
  timeAvailability: 0.20,
  dietary: 0.15,
  budget: 0.15,
  age: 0.10,
  interests: 0.15,
};

/**
 * Calculate proximity score based on location regions
 */
function calculateProximityScore(user1: User, user2: User): number {
  if (!user1.location || !user2.location) return 0.5; // Neutral if location not set
  
  // Same location gets full score
  if (user1.location === user2.location) return 1.0;
  
  // Adjacent regions get partial score
  // For simplicity, different locations get 0.3 score
  return 0.3;
}

/**
 * Calculate dietary compatibility score
 */
function calculateDietaryScore(user1: User, user2: User): number {
  if (!user1.dietaryRestrictions && !user2.dietaryRestrictions) return 1.0;
  
  try {
    const diet1 = user1.dietaryRestrictions ? JSON.parse(user1.dietaryRestrictions) : [];
    const diet2 = user2.dietaryRestrictions ? JSON.parse(user2.dietaryRestrictions) : [];
    
    // If one has restrictions and other doesn't, medium compatibility
    if (diet1.length === 0 || diet2.length === 0) return 0.7;
    
    // Calculate overlap in dietary restrictions
    const commonRestrictions = diet1.filter((r: string) => diet2.includes(r));
    const totalRestrictions = new Set([...diet1, ...diet2]).size;
    
    // More common restrictions = better match
    return commonRestrictions.length / totalRestrictions;
  } catch {
    return 0.5; // Default if parsing fails
  }
}

/**
 * Calculate budget compatibility score
 */
function calculateBudgetScore(user1: User, user2: User): number {
  if (!user1.budgetMin || !user1.budgetMax || !user2.budgetMin || !user2.budgetMax) {
    return 0.7; // Neutral if budget not set
  }
  
  // Calculate overlap of budget ranges
  const overlapMin = Math.max(user1.budgetMin, user2.budgetMin);
  const overlapMax = Math.min(user1.budgetMax, user2.budgetMax);
  
  if (overlapMin > overlapMax) return 0.0; // No overlap
  
  const overlapRange = overlapMax - overlapMin;
  const avgRange = ((user1.budgetMax - user1.budgetMin) + (user2.budgetMax - user2.budgetMin)) / 2;
  
  return Math.min(1.0, overlapRange / avgRange);
}

/**
 * Calculate age compatibility score
 */
function calculateAgeScore(user1: User, user2: User): number {
  if (!user1.age || !user2.age) return 0.7; // Neutral if age not set
  
  const ageDiff = Math.abs(user1.age - user2.age);
  
  // Check preferences
  if (user1.preferredAgeMin && user1.preferredAgeMax) {
    if (user2.age < user1.preferredAgeMin || user2.age > user1.preferredAgeMax) {
      return 0.2; // Low score if outside preferred range
    }
  }
  
  if (user2.preferredAgeMin && user2.preferredAgeMax) {
    if (user1.age < user2.preferredAgeMin || user1.age > user2.preferredAgeMax) {
      return 0.2; // Low score if outside preferred range
    }
  }
  
  // Score based on age difference
  if (ageDiff <= 5) return 1.0;
  if (ageDiff <= 10) return 0.8;
  if (ageDiff <= 15) return 0.6;
  return 0.4;
}

/**
 * Calculate interests compatibility score
 */
function calculateInterestsScore(user1: User, user2: User): number {
  if (!user1.interests || !user2.interests) return 0.5; // Neutral if interests not set
  
  try {
    const interests1 = JSON.parse(user1.interests);
    const interests2 = JSON.parse(user2.interests);
    
    if (interests1.length === 0 || interests2.length === 0) return 0.5;
    
    const commonInterests = interests1.filter((i: string) => interests2.includes(i));
    const totalInterests = new Set([...interests1, ...interests2]).size;
    
    return commonInterests.length / totalInterests;
  } catch {
    return 0.5;
  }
}

/**
 * Check gender preference compatibility
 */
function checkGenderPreference(user1: User, user2: User): boolean {
  // Check if user1's preference matches user2's gender
  if (user1.preferredGender && user1.preferredGender !== 'any') {
    if (user2.gender !== user1.preferredGender) return false;
  }
  
  // Check if user2's preference matches user1's gender
  if (user2.preferredGender && user2.preferredGender !== 'any') {
    if (user1.gender !== user2.preferredGender) return false;
  }
  
  return true;
}

/**
 * Check background preference compatibility
 */
function checkBackgroundPreference(user1: User, user2: User): boolean {
  // Check if user1's preference matches user2's background
  if (user1.preferredBackground && user1.preferredBackground !== 'any') {
    if (user2.background !== user1.preferredBackground) return false;
  }
  
  // Check if user2's preference matches user1's background
  if (user2.preferredBackground && user2.preferredBackground !== 'any') {
    if (user1.background !== user2.preferredBackground) return false;
  }
  
  return true;
}

/**
 * Calculate overall match score between two users
 */
export function calculateMatchScore(
  user1: User,
  user2: User,
  weights: MatchCriteria = DEFAULT_WEIGHTS,
  timeAvailabilityScore: number = 0.5 // This would come from availability checking
): number {
  // First check hard preferences
  if (!checkGenderPreference(user1, user2)) return 0;
  if (!checkBackgroundPreference(user1, user2)) return 0;
  
  // Calculate individual scores
  const proximityScore = calculateProximityScore(user1, user2);
  const dietaryScore = calculateDietaryScore(user1, user2);
  const budgetScore = calculateBudgetScore(user1, user2);
  const ageScore = calculateAgeScore(user1, user2);
  const interestsScore = calculateInterestsScore(user1, user2);
  
  // Calculate weighted total
  const totalScore = 
    proximityScore * weights.proximity +
    timeAvailabilityScore * weights.timeAvailability +
    dietaryScore * weights.dietary +
    budgetScore * weights.budget +
    ageScore * weights.age +
    interestsScore * weights.interests;
  
  return totalScore;
}

/**
 * Adjust matching weights based on feedback using simple learning
 */
export function adjustWeightsFromFeedback(
  currentWeights: MatchCriteria,
  successfulMatches: Array<{ score: number; feedback: { rating: number } }>,
  learningRate: number = 0.1
): MatchCriteria {
  // This is a simplified AI learning approach
  // In production, you'd use more sophisticated ML techniques
  
  // Return current weights if no matches to learn from
  if (successfulMatches.length === 0) {
    return currentWeights;
  }
  
  const avgRating = successfulMatches.reduce((sum, m) => sum + m.feedback.rating, 0) / successfulMatches.length;
  
  // If average rating is high (>3.5), increase weights slightly
  // If low (<2.5), decrease weights slightly
  const adjustment = (avgRating - 3) / 10 * learningRate;
  
  return {
    proximity: Math.max(0, Math.min(1, currentWeights.proximity + adjustment)),
    timeAvailability: Math.max(0, Math.min(1, currentWeights.timeAvailability + adjustment)),
    dietary: Math.max(0, Math.min(1, currentWeights.dietary + adjustment)),
    budget: Math.max(0, Math.min(1, currentWeights.budget + adjustment)),
    age: Math.max(0, Math.min(1, currentWeights.age + adjustment)),
    interests: Math.max(0, Math.min(1, currentWeights.interests + adjustment)),
  };
}
