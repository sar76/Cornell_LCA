import { pharmaceuticalData, calculateLifecycleEmissions } from './pharmaceuticalData';

export interface ProductNode {
  id: string;
  label: string;
  title: string;
  color: string;
  size: number;
  healthcareField: string;
  specialty: string;
  emissions: {
    rawMaterials: number;
    manufacturing: number;
    transportation: number;
    use: number;
    endOfLife: number;
  };
  hotspot: string;
}

export interface ProductEdge {
  from: string;
  to: string;
  value: number;
  title: string;
  color: string;
  width: number;
}

export interface NetworkData {
  nodes: ProductNode[];
  edges: ProductEdge[];
}

// Extract key environmental terms from hotspot descriptions
function extractEnvironmentalTerms(hotspot: string): string[] {
  const terms = hotspot.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 3)
    .filter(term => !['phase', 'emissions', 'generates', 'requires', 'consuming', 'through', 'systems', 'during', 'with', 'from', 'per', 'and', 'the', 'are', 'for', 'in', 'of', 'to', 'at', 'by', 'is', 'as', 'an', 'a'].includes(term));
  
  return [...new Set(terms)];
}

// Calculate similarity between two products based on multiple factors
function calculateSimilarity(product1: any, product2: any): number {
  let similarity = 0;
  let factors = 0;

  // 1. Healthcare field similarity (30% weight)
  if (product1.healthcareField === product2.healthcareField) {
    similarity += 0.3;
  }
  factors += 0.3;

  // 2. Specialty similarity (25% weight)
  if (product1.specialty === product2.specialty) {
    similarity += 0.25;
  }
  factors += 0.25;

  // 3. Emissions profile similarity (25% weight)
  const emissions1 = calculateLifecycleEmissions(product1.includedStages, product1.healthcareField, product1.specialty);
  const emissions2 = calculateLifecycleEmissions(product2.includedStages, product2.healthcareField, product2.specialty);
  
  const emissionsSimilarity = 1 - (
    Math.abs(emissions1.rawMaterials - emissions2.rawMaterials) +
    Math.abs(emissions1.manufacturing - emissions2.manufacturing) +
    Math.abs(emissions1.transportation - emissions2.transportation) +
    Math.abs(emissions1.use - emissions2.use) +
    Math.abs(emissions1.endOfLife - emissions2.endOfLife)
  ) / 500; // Normalize by max possible difference (5 * 100)
  
  similarity += Math.max(0, emissionsSimilarity) * 0.25;
  factors += 0.25;

  // 4. Hotspot term similarity (20% weight)
  if (product1.hotspot && product2.hotspot) {
    const terms1 = extractEnvironmentalTerms(product1.hotspot);
    const terms2 = extractEnvironmentalTerms(product2.hotspot);
    
    const commonTerms = terms1.filter(term => terms2.includes(term));
    const totalTerms = new Set([...terms1, ...terms2]).size;
    
    if (totalTerms > 0) {
      const termSimilarity = commonTerms.length / totalTerms;
      similarity += termSimilarity * 0.2;
    }
  }
  factors += 0.2;

  return factors > 0 ? similarity / factors : 0;
}

// Get color based on healthcare field
function getHealthcareFieldColor(healthcareField: string): string {
  const colors: { [key: string]: string } = {
    'Medicine': '#0ea5e9',
    'Pharmacy': '#22c55e',
    'Dentistry': '#f59e0b',
    'Healthcare': '#8b5cf6',
    'Surgery': '#ef4444'
  };
  return colors[healthcareField] || '#64748b';
}

// Get node size based on manufacturing emissions (higher manufacturing = larger node)
function getNodeSize(emissions: any): number {
  const manufacturingPercent = emissions.manufacturing;
  return Math.max(20, Math.min(50, 20 + (manufacturingPercent * 0.3)));
}

// Generate network data for all pharmaceutical products
export function generateNetworkData(): NetworkData {
  const nodes: ProductNode[] = [];
  const edges: ProductEdge[] = [];
  
  // Create nodes for all products
  pharmaceuticalData.forEach((product, index) => {
    const emissions = calculateLifecycleEmissions(
      product.includedStages,
      product.healthcareField,
      product.specialty
    );
    
    nodes.push({
      id: `product_${index}`,
      label: product.dataSourceTopic.length > 30 
        ? product.dataSourceTopic.substring(0, 30) + '...'
        : product.dataSourceTopic,
      title: `${product.dataSourceTopic}\n${product.healthcareField} - ${product.specialty}\nManufacturing: ${emissions.manufacturing}%`,
      color: getHealthcareFieldColor(product.healthcareField),
      size: getNodeSize(emissions),
      healthcareField: product.healthcareField,
      specialty: product.specialty,
      emissions: emissions,
      hotspot: product.hotspot || ''
    });
  });

  // Create edges based on similarity
  const similarityThreshold = 0.4; // Only show edges for products with >40% similarity
  
  for (let i = 0; i < pharmaceuticalData.length; i++) {
    for (let j = i + 1; j < pharmaceuticalData.length; j++) {
      const similarity = calculateSimilarity(pharmaceuticalData[i], pharmaceuticalData[j]);
      
      if (similarity >= similarityThreshold) {
        const edgeWidth = Math.max(1, similarity * 5); // Scale edge width based on similarity
        const edgeColor = similarity > 0.7 ? '#22c55e' : similarity > 0.5 ? '#f59e0b' : '#64748b';
        
        edges.push({
          from: `product_${i}`,
          to: `product_${j}`,
          value: similarity,
          title: `Similarity: ${Math.round(similarity * 100)}%\n${pharmaceuticalData[i].dataSourceTopic} ↔ ${pharmaceuticalData[j].dataSourceTopic}`,
          color: edgeColor,
          width: edgeWidth
        });
      }
    }
  }

  return { nodes, edges };
}

// Get network statistics
export function getNetworkStatistics(networkData: NetworkData) {
  const totalNodes = networkData.nodes.length;
  const totalEdges = networkData.edges.length;
  
  // Calculate average similarity
  const avgSimilarity = networkData.edges.length > 0 
    ? networkData.edges.reduce((sum, edge) => sum + edge.value, 0) / networkData.edges.length
    : 0;
  
  // Find most connected node
  const nodeConnections = networkData.nodes.map(node => ({
    id: node.id,
    label: node.label,
    connections: networkData.edges.filter(edge => 
      edge.from === node.id || edge.to === node.id
    ).length
  }));
  
  const mostConnected = nodeConnections.reduce((max, current) => 
    current.connections > max.connections ? current : max
  );
  
  // Group by healthcare field
  const fieldGroups = networkData.nodes.reduce((groups, node) => {
    const field = node.healthcareField;
    groups[field] = (groups[field] || 0) + 1;
    return groups;
  }, {} as { [key: string]: number });
  
  return {
    totalNodes,
    totalEdges,
    averageSimilarity: Math.round(avgSimilarity * 100),
    mostConnectedNode: mostConnected,
    fieldDistribution: fieldGroups
  };
}
