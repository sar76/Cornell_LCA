import { useState, useMemo } from 'react';
import Link from 'next/link';
import { pharmaceuticalData, calculateLifecycleEmissions } from '../lib/pharmaceuticalData';
import { generateNetworkData } from '../lib/similarityAnalysis';
import LifecycleEmissionsChart from '../components/LifecycleEmissionsChart';
import NetworkGraph from '../components/NetworkGraph';
import styles from '../styles/Analytics.module.css';

export default function Analytics() {
  const [selectedHealthcareField, setSelectedHealthcareField] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'emissions' | 'network'>('emissions');

  // Get unique healthcare fields and specialties for filter options
  const healthcareFields = useMemo(() => {
    const fields = [...new Set(pharmaceuticalData.map(item => item.healthcareField))];
    return fields.sort();
  }, []);

  const specialties = useMemo(() => {
    const specs = [...new Set(pharmaceuticalData.map(item => item.specialty))];
    return specs.sort();
  }, []);

  // Filter pharmaceutical data based on selected filters
  const filteredData = useMemo(() => {
    return pharmaceuticalData.filter(item => {
      const matchesHealthcare = !selectedHealthcareField || item.healthcareField === selectedHealthcareField;
      const matchesSpecialty = !selectedSpecialty || item.specialty === selectedSpecialty;
      return matchesHealthcare && matchesSpecialty;
    });
  }, [selectedHealthcareField, selectedSpecialty]);

  // Calculate aggregated lifecycle emissions
  const aggregatedEmissions = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        rawMaterials: 0,
        manufacturing: 0,
        transportation: 0,
        use: 0,
        endOfLife: 0
      };
    }

    // Calculate emissions for each filtered entry
    const allEmissions = filteredData.map(item => {
      const percentages = calculateLifecycleEmissions(
        item.includedStages,
        item.healthcareField,
        item.specialty
      );
      
      // Convert percentages to realistic CO2 values (assuming average 5 kg CO2-eq per product)
      const totalCO2 = 5.0; // Average total CO2 per product
      return {
        rawMaterials: (percentages.rawMaterials / 100) * totalCO2,
        manufacturing: (percentages.manufacturing / 100) * totalCO2,
        transportation: (percentages.transportation / 100) * totalCO2,
        use: (percentages.use / 100) * totalCO2,
        endOfLife: (percentages.endOfLife / 100) * totalCO2
      };
    });

    // Average the emissions across all filtered entries
    const total = allEmissions.reduce((acc, emissions) => ({
      rawMaterials: acc.rawMaterials + emissions.rawMaterials,
      manufacturing: acc.manufacturing + emissions.manufacturing,
      transportation: acc.transportation + emissions.transportation,
      use: acc.use + emissions.use,
      endOfLife: acc.endOfLife + emissions.endOfLife
    }), { rawMaterials: 0, manufacturing: 0, transportation: 0, use: 0, endOfLife: 0 });

    return {
      rawMaterials: Math.round((total.rawMaterials / allEmissions.length) * 100) / 100,
      manufacturing: Math.round((total.manufacturing / allEmissions.length) * 100) / 100,
      transportation: Math.round((total.transportation / allEmissions.length) * 100) / 100,
      use: Math.round((total.use / allEmissions.length) * 100) / 100,
      endOfLife: Math.round((total.endOfLife / allEmissions.length) * 100) / 100
    };
  }, [filteredData]);

  // Generate network data
  const networkData = useMemo(() => {
    return generateNetworkData();
  }, []);

  const clearFilters = () => {
    setSelectedHealthcareField('');
    setSelectedSpecialty('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Directory
        </Link>
        <h1 className={styles.title}>Analytics Dashboard</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === 'emissions' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('emissions')}
          >
            📊 Emissions Analysis
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'network' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('network')}
          >
            🕸️ Similarity Network
          </button>
        </div>

        {activeTab === 'emissions' && (
          <>
            <div className={styles.filtersSection}>
              <h2 className={styles.sectionTitle}>Filter by Category</h2>
              <div className={styles.filters}>
                <div className={styles.filterGroup}>
                  <label htmlFor="healthcare-field" className={styles.filterLabel}>
                    Healthcare Field:
                  </label>
                  <select
                    id="healthcare-field"
                    value={selectedHealthcareField}
                    onChange={(e) => setSelectedHealthcareField(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">All Fields</option>
                    {healthcareFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label htmlFor="specialty" className={styles.filterLabel}>
                    Specialty:
                  </label>
                  <select
                    id="specialty"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">All Specialties</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                <button onClick={clearFilters} className={styles.clearButton}>
                  Clear Filters
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'emissions' && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.sectionTitle}>
                Aggregated Emissions Profile
              </h2>
              <div className={styles.resultsInfo}>
                <span className={styles.resultsCount}>
                  {filteredData.length} {filteredData.length === 1 ? 'entry' : 'entries'} selected
                </span>
                {(selectedHealthcareField || selectedSpecialty) && (
                  <span className={styles.activeFilters}>
                    {selectedHealthcareField && `Field: ${selectedHealthcareField}`}
                    {selectedHealthcareField && selectedSpecialty && ' • '}
                    {selectedSpecialty && `Specialty: ${selectedSpecialty}`}
                  </span>
                )}
              </div>
            </div>

            {filteredData.length > 0 ? (
              <div className={styles.chartSection}>
                <div className={styles.chartContainer}>
                  <LifecycleEmissionsChart emissions={aggregatedEmissions} />
                </div>
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No entries match the selected filters.</p>
                <p>Try adjusting your filter criteria or clear all filters to see all entries.</p>
              </div>
            )}

            {filteredData.length > 0 && (
              <div className={styles.entriesList}>
                <h3 className={styles.listTitle}>Included Entries:</h3>
                <div className={styles.entriesGrid}>
                  {filteredData.map((item, index) => (
                    <div key={index} className={styles.entryCard}>
                      <h4 className={styles.entryTitle}>{item.dataSourceTopic}</h4>
                      <div className={styles.entryTags}>
                        <span className={styles.tag}>{item.healthcareField}</span>
                        <span className={styles.tag}>{item.specialty}</span>
                      </div>
                      <p className={styles.entryAuthors}>{item.authors}</p>
                      <p className={styles.entryYear}>{item.publicationYear}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'network' && (
          <div className={styles.networkSection}>
            <NetworkGraph data={networkData} />
          </div>
        )}
      </div>
    </div>
  );
}
