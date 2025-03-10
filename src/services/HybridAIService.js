/**
 * HybridAIService.js
 * 
 * A self-learning AI system for the 3D Pergola Designer
 * This service implements a hybrid approach that:
 * 1. Observes user interactions and design choices
 * 2. Learns patterns and preferences over time
 * 3. Provides intelligent recommendations
 * 4. Prevents design errors in real-time
 */

class HybridAIService {
  constructor() {
    // User interaction history
    this.interactionHistory = [];
    
    // Learning phases
    this.observationPhase = true; // First 6 months in observation mode
    this.independentLearningPhase = false;
    
    // Design patterns learned from user interactions
    this.learnedPatterns = {
      dimensions: {},
      materials: {},
      pillars: {},
      rafters: {}
    };
    
    // Common design errors and their prevention strategies
    this.errorPrevention = {
      structuralIntegrity: {
        check: this.checkStructuralIntegrity,
        message: "The current dimensions may create structural stability issues."
      },
      materialCompatibility: {
        check: this.checkMaterialCompatibility,
        message: "The selected materials may not be optimal for your environment."
      },
      aestheticBalance: {
        check: this.checkAestheticBalance,
        message: "Consider adjusting the rafter spacing for better visual balance."
      }
    };
  }
  
  /**
   * Record a user interaction for learning
   * @param {string} interactionType - Type of interaction (e.g., 'dimension_change', 'material_select')
   * @param {object} data - Data associated with the interaction
   */
  recordInteraction(interactionType, data) {
    const interaction = {
      type: interactionType,
      data: data,
      timestamp: new Date().toISOString()
    };
    
    this.interactionHistory.push(interaction);
    
    // If we're in observation phase, update learned patterns
    if (this.observationPhase) {
      this.updateLearnedPatterns(interaction);
    }
    
    // Return the interaction for logging purposes
    return interaction;
  }
  
  /**
   * Update learned patterns based on user interactions
   * @param {object} interaction - The user interaction to learn from
   */
  updateLearnedPatterns(interaction) {
    const { type, data } = interaction;
    
    switch (type) {
      case 'dimension_change':
        // Update dimension preferences
        if (!this.learnedPatterns.dimensions[data.dimension]) {
          this.learnedPatterns.dimensions[data.dimension] = [];
        }
        this.learnedPatterns.dimensions[data.dimension].push(data.value);
        break;
        
      case 'material_select':
        // Update material preferences
        if (!this.learnedPatterns.materials[data.material]) {
          this.learnedPatterns.materials[data.material] = 0;
        }
        this.learnedPatterns.materials[data.material]++;
        break;
        
      case 'pillar_change':
        // Update pillar preferences
        if (!this.learnedPatterns.pillars[data.property]) {
          this.learnedPatterns.pillars[data.property] = [];
        }
        this.learnedPatterns.pillars[data.property].push(data.value);
        break;
        
      case 'rafter_change':
        // Update rafter preferences
        if (!this.learnedPatterns.rafters[data.property]) {
          this.learnedPatterns.rafters[data.property] = [];
        }
        this.learnedPatterns.rafters[data.property].push(data.value);
        break;
        
      default:
        // Unknown interaction type, no learning
        break;
    }
  }
  
  /**
   * Generate design recommendations based on current design and learned patterns
   * @param {object} currentDesign - The current pergola design
   * @returns {array} - Array of recommendation objects
   */
  generateRecommendations(currentDesign) {
    const recommendations = [];
    
    // Check for potential errors
    const errors = this.checkForErrors(currentDesign);
    recommendations.push(...errors);
    
    // Generate dimension recommendations
    if (currentDesign.dimensions) {
      const dimensionRecs = this.generateDimensionRecommendations(currentDesign.dimensions);
      recommendations.push(...dimensionRecs);
    }
    
    // Generate material recommendations
    if (currentDesign.material) {
      const materialRecs = this.generateMaterialRecommendations(currentDesign.material, currentDesign.materialColor);
      recommendations.push(...materialRecs);
    }
    
    // Generate advanced customization recommendations
    if (currentDesign.pillars && currentDesign.rafters) {
      const customizationRecs = this.generateCustomizationRecommendations(currentDesign.pillars, currentDesign.rafters);
      recommendations.push(...customizationRecs);
    }
    
    return recommendations;
  }
  
  /**
   * Check for potential errors in the current design
   * @param {object} currentDesign - The current pergola design
   * @returns {array} - Array of error objects
   */
  checkForErrors(currentDesign) {
    const errors = [];
    
    // Check structural integrity
    if (this.errorPrevention.structuralIntegrity.check(currentDesign)) {
      errors.push({
        type: 'error',
        category: 'structural',
        message: this.errorPrevention.structuralIntegrity.message,
        severity: 'high'
      });
    }
    
    // Check material compatibility
    if (this.errorPrevention.materialCompatibility.check(currentDesign)) {
      errors.push({
        type: 'error',
        category: 'material',
        message: this.errorPrevention.materialCompatibility.message,
        severity: 'medium'
      });
    }
    
    // Check aesthetic balance
    if (this.errorPrevention.aestheticBalance.check(currentDesign)) {
      errors.push({
        type: 'warning',
        category: 'aesthetic',
        message: this.errorPrevention.aestheticBalance.message,
        severity: 'low'
      });
    }
    
    return errors;
  }
  
  /**
   * Check structural integrity of the design
   * @param {object} design - The current pergola design
   * @returns {boolean} - True if there are structural issues
   */
  checkStructuralIntegrity(design) {
    // Example implementation - in reality, this would be more complex
    const { dimensions, pillars } = design;
    
    // Check if the pergola is too large for the number of pillars
    const area = dimensions.length * dimensions.width;
    const pillarDensity = pillars.count / area;
    
    // If pillar density is too low for a large pergola, flag as an issue
    return (area > 15 && pillarDensity < 0.5);
  }
  
  /**
   * Check material compatibility with design
   * @param {object} design - The current pergola design
   * @returns {boolean} - True if there are material compatibility issues
   */
  checkMaterialCompatibility(design) {
    // Example implementation
    const { material, dimensions } = design;
    
    // Wood might not be ideal for very large pergolas
    return (material === 'wood' && dimensions.length * dimensions.width > 20);
  }
  
  /**
   * Check aesthetic balance of the design
   * @param {object} design - The current pergola design
   * @returns {boolean} - True if there are aesthetic issues
   */
  checkAestheticBalance(design) {
    // Example implementation
    const { rafters, dimensions } = design;
    
    // Check if rafter spacing is proportional to pergola size
    const idealSpacing = Math.sqrt(dimensions.length * dimensions.width) / 10;
    const currentSpacing = rafters.spacing;
    
    return Math.abs(currentSpacing - idealSpacing) > 0.3;
  }
  
  /**
   * Generate dimension recommendations
   * @param {object} currentDimensions - Current dimensions
   * @returns {array} - Array of recommendation objects
   */
  generateDimensionRecommendations(currentDimensions) {
    const recommendations = [];
    
    // Example: Recommend standard dimensions if current ones are unusual
    const standardSizes = [
      { length: 3, width: 3, height: 2.5 },
      { length: 4, width: 3, height: 2.5 },
      { length: 5, width: 4, height: 2.8 }
    ];
    
    // Find the closest standard size
    let closestSize = null;
    let minDifference = Infinity;
    
    for (const size of standardSizes) {
      const difference = Math.abs(size.length - currentDimensions.length) + 
                         Math.abs(size.width - currentDimensions.width) +
                         Math.abs(size.height - currentDimensions.height);
      
      if (difference < minDifference && difference > 0.5) {
        minDifference = difference;
        closestSize = size;
      }
    }
    
    if (closestSize) {
      recommendations.push({
        type: 'suggestion',
        category: 'dimensions',
        message: `Consider standard dimensions of ${closestSize.length}m x ${closestSize.width}m x ${closestSize.height}m for better proportions.`,
        value: closestSize
      });
    }
    
    return recommendations;
  }
  
  /**
   * Generate material recommendations
   * @param {string} currentMaterial - Current material
   * @param {string} currentColor - Current material color
   * @returns {array} - Array of recommendation objects
   */
  generateMaterialRecommendations(currentMaterial, currentColor) {
    const recommendations = [];
    
    // Example: Recommend complementary materials
    const materialPairs = {
      'aluminium': ['wood', 'composite'],
      'wood': ['aluminium', 'steel'],
      'steel': ['wood', 'glass'],
      'composite': ['aluminium', 'glass']
    };
    
    if (materialPairs[currentMaterial]) {
      const recommendedMaterial = materialPairs[currentMaterial][0];
      
      recommendations.push({
        type: 'suggestion',
        category: 'material',
        message: `${recommendedMaterial.charAt(0).toUpperCase() + recommendedMaterial.slice(1)} accents would complement your ${currentMaterial} pergola beautifully.`,
        value: recommendedMaterial
      });
    }
    
    return recommendations;
  }
  
  /**
   * Generate customization recommendations for pillars and rafters
   * @param {object} currentPillars - Current pillar configuration
   * @param {object} currentRafters - Current rafter configuration
   * @returns {array} - Array of recommendation objects
   */
  generateCustomizationRecommendations(currentPillars, currentRafters) {
    const recommendations = [];
    
    // Example: Recommend crosshatch pattern for larger pergolas
    if (currentRafters.pattern !== 'crosshatch' && 
        currentPillars.count >= 6) {
      recommendations.push({
        type: 'suggestion',
        category: 'rafters',
        message: 'A crosshatch rafter pattern would enhance the visual appeal of your larger pergola design.',
        value: { pattern: 'crosshatch' }
      });
    }
    
    // Example: Recommend denser rafter spacing for better shade
    if (currentRafters.spacing > 0.4) {
      recommendations.push({
        type: 'suggestion',
        category: 'rafters',
        message: 'Reducing rafter spacing to 0.3m would provide better shade while maintaining the open feel.',
        value: { spacing: 0.3 }
      });
    }
    
    return recommendations;
  }
  
  /**
   * Transition from observation to independent learning phase
   */
  transitionToIndependentLearning() {
    this.observationPhase = false;
    this.independentLearningPhase = true;
    
    // In a real implementation, this would involve training a machine learning model
    console.log('Transitioning to independent learning phase');
    console.log('Learned patterns:', this.learnedPatterns);
  }
}

// Create and export a singleton instance
const hybridAIService = new HybridAIService();
export default hybridAIService;
