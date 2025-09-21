import React, { useEffect, useRef, useState } from 'react';
import { NetworkData, getNetworkStatistics } from '../lib/similarityAnalysis';
import styles from '../styles/NetworkGraph.module.css';

interface NetworkGraphProps {
  data: NetworkData;
}

// Type definitions for vis-network
interface VisNode {
  id: string;
  label: string;
  title: string;
  color: string;
  size: number;
}

interface VisEdge {
  from: string;
  to: string;
  value: number;
  title: string;
  color: string;
  width: number;
}

interface VisNetworkOptions {
  nodes: {
    shape: string;
    font: {
      size: number;
      color: string;
    };
    borderWidth: number;
    shadow: boolean;
  };
  edges: {
    width: number;
    color: {
      color: string;
      highlight: string;
    };
    smooth: {
      type: string;
      roundness: number;
    };
    arrows: {
      to: {
        enabled: boolean;
        scaleFactor: number;
      };
    };
  };
  physics: {
    enabled: boolean;
    stabilization: {
      iterations: number;
    };
    barnesHut: {
      gravitationalConstant: number;
      centralGravity: number;
      springLength: number;
      springConstant: number;
      damping: number;
    };
  };
  interaction: {
    hover: boolean;
    tooltipDelay: number;
    hideEdgesOnDrag: boolean;
  };
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data }) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!networkRef.current || !data) return;

    // Dynamically import vis-network
    import('vis-network').then(({ Network }) => {
      // Convert our data to vis-network format
      const visNodes = data.nodes.map(node => ({
        id: node.id,
        label: node.label,
        title: node.title,
        color: {
          background: node.color,
          border: '#2B2B2B',
          highlight: {
            background: node.color,
            border: '#FF6B6B'
          }
        },
        size: node.size,
        font: {
          size: 12,
          color: '#2B2B2B'
        }
      }));

      const visEdges = data.edges.map(edge => ({
        from: edge.from,
        to: edge.to,
        value: edge.value,
        title: edge.title,
        color: {
          color: edge.color,
          highlight: '#FF6B6B'
        },
        width: edge.width,
        smooth: {
          type: 'continuous',
          roundness: 0.2
        }
      }));

      const visData = {
        nodes: visNodes,
        edges: visEdges
      };

      const options: VisNetworkOptions = {
        nodes: {
          shape: 'circle',
          font: {
            size: 12,
            color: '#2B2B2B'
          },
          borderWidth: 2,
          shadow: true
        },
        edges: {
          width: 2,
          color: {
            color: '#848484',
            highlight: '#FF6B6B'
          },
          smooth: {
            type: 'continuous',
            roundness: 0.2
          },
          arrows: {
            to: {
              enabled: false
            }
          }
        },
        physics: {
          enabled: true,
          stabilization: {
            iterations: 100
          },
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.1,
            springLength: 200,
            springConstant: 0.04,
            damping: 0.09
          }
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          hideEdgesOnDrag: true
        }
      };

      const networkInstance = new Network(networkRef.current, visData, options);
      setNetwork(networkInstance);

      // Add event listeners
      networkInstance.on('selectNode', (params: any) => {
        if (params.nodes.length > 0) {
          setSelectedNode(params.nodes[0]);
        }
      });

      networkInstance.on('deselectNode', () => {
        setSelectedNode(null);
      });

      // Calculate statistics
      const stats = getNetworkStatistics(data);
      setStatistics(stats);
    });

    return () => {
      if (network) {
        network.destroy();
      }
    };
  }, [data]);

  const selectedNodeData = selectedNode ? data.nodes.find(node => node.id === selectedNode) : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Product Similarity Network</h3>
        <p className={styles.subtitle}>
          Nodes represent pharmaceutical products, edges show environmental similarity
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.networkContainer}>
          <div ref={networkRef} className={styles.network} />
        </div>

        <div className={styles.sidebar}>
          {statistics && (
            <div className={styles.statistics}>
              <h4 className={styles.statisticsTitle}>Network Statistics</h4>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Products:</span>
                <span className={styles.statValue}>{statistics.totalNodes}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Similarity Connections:</span>
                <span className={styles.statValue}>{statistics.totalEdges}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Average Similarity:</span>
                <span className={styles.statValue}>{statistics.averageSimilarity}%</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Most Connected:</span>
                <span className={styles.statValue}>{statistics.mostConnectedNode.label}</span>
              </div>
            </div>
          )}

          {selectedNodeData && (
            <div className={styles.nodeDetails}>
              <h4 className={styles.detailsTitle}>Selected Product</h4>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Name:</span>
                <span className={styles.detailValue}>{selectedNodeData.label}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Field:</span>
                <span className={styles.detailValue}>{selectedNodeData.healthcareField}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Specialty:</span>
                <span className={styles.detailValue}>{selectedNodeData.specialty}</span>
              </div>
              <div className={styles.emissionsBreakdown}>
                <span className={styles.detailLabel}>Emissions Profile:</span>
                <div className={styles.emissionsList}>
                  <div className={styles.emissionItem}>
                    <span>Raw Materials:</span>
                    <span>{selectedNodeData.emissions.rawMaterials}%</span>
                  </div>
                  <div className={styles.emissionItem}>
                    <span>Manufacturing:</span>
                    <span>{selectedNodeData.emissions.manufacturing}%</span>
                  </div>
                  <div className={styles.emissionItem}>
                    <span>Transportation:</span>
                    <span>{selectedNodeData.emissions.transportation}%</span>
                  </div>
                  <div className={styles.emissionItem}>
                    <span>Use:</span>
                    <span>{selectedNodeData.emissions.use}%</span>
                  </div>
                  <div className={styles.emissionItem}>
                    <span>End of Life:</span>
                    <span>{selectedNodeData.emissions.endOfLife}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.legend}>
            <h4 className={styles.legendTitle}>Legend</h4>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#0ea5e9' }}></div>
              <span>Medicine</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#22c55e' }}></div>
              <span>Pharmacy</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#f59e0b' }}></div>
              <span>Dentistry</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#8b5cf6' }}></div>
              <span>Healthcare</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#ef4444' }}></div>
              <span>Surgery</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#64748b' }}></div>
              <span>Other</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
