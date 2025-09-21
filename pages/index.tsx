import { useState } from 'react';
import Link from 'next/link';
import { getAllPharmaceuticals, PharmaceuticalData } from '../lib/pharmaceuticalData';
import styles from '../styles/Directory.module.css';

export default function Directory() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const pharmaceuticals = getAllPharmaceuticals();
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(pharmaceuticals.map(p => p.healthcareField)))];
  
  // Filter pharmaceuticals based on category and search term
  const filteredPharmaceuticals = pharmaceuticals.filter(pharma => {
    const matchesCategory = selectedCategory === 'all' || pharma.healthcareField === selectedCategory;
    const matchesSearch = pharma.dataSourceTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharma.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharma.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Medicine': '#3B82F6',
      'Pharmacy': '#10B981',
      'Dentistry': '#F59E0B',
      'Healthcare': '#8B5CF6',
      'Surgery': '#EF4444'
    };
    return colors[category] || '#6B7280';
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: { [key: string]: string } = {
      'Oncology': '#DC2626',
      'Anesthesiology': '#059669',
      'Healthcare': '#7C3AED',
      'Dentistry': '#D97706',
      'Pediatric Dentistry': '#D97706',
      'Cardiology': '#DB2777',
      'Respiratory medicine': '#0891B2',
      'Infectious disease': '#CA8A04',
      'Surgery': '#EC4899',
      'Urology': '#7C2D12',
      'ENT': '#1E40AF',
      'Gastroenterology': '#059669',
      'Ophthalmology': '#7C3AED',
      'Pediatrics': '#DB2777',
      'Public health': '#0891B2'
    };
    return colors[specialty] || '#6B7280';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>VerdentRx Directory</h1>
        <p className={styles.subtitle}>
          Explore Life Cycle Assessment Studies for Pharmaceutical Products and Processes
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search pharmaceuticals, studies, or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.analyticsButtonContainer}>
          <Link href="/analytics" className={styles.analyticsButton}>
            📊 Analytics Dashboard
          </Link>
        </div>

        <div className={styles.categoryFilter}>
          <label className={styles.filterLabel}>Filter by Category:</label>
          <div className={styles.categoryButtons}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${styles.categoryButton} ${
                  selectedCategory === category ? styles.categoryButtonActive : ''
                }`}
                style={{
                  backgroundColor: selectedCategory === category 
                    ? getCategoryColor(category) 
                    : 'transparent',
                  borderColor: getCategoryColor(category)
                }}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.resultsInfo}>
        <p className={styles.resultsCount}>
          Showing {filteredPharmaceuticals.length} of {pharmaceuticals.length} studies
        </p>
      </div>

      <div className={styles.grid}>
        {filteredPharmaceuticals.map((pharma, index) => {
          const productId = pharma.dataSourceTopic.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <Link key={index} href={`/pharmaceutical/${productId}`}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div 
                    className={styles.categoryBadge}
                    style={{ backgroundColor: getCategoryColor(pharma.healthcareField) }}
                  >
                    {pharma.healthcareField}
                  </div>
                  <div 
                    className={styles.specialtyBadge}
                    style={{ backgroundColor: getSpecialtyColor(pharma.specialty) }}
                  >
                    {pharma.specialty}
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{pharma.dataSourceTopic}</h3>
                  <p className={styles.cardAbstract}>
                    {pharma.abstract.length > 150 
                      ? `${pharma.abstract.substring(0, 150)}...` 
                      : pharma.abstract
                    }
                  </p>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Journal:</span>
                      <span className={styles.metaValue}>{pharma.journal}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Year:</span>
                      <span className={styles.metaValue}>{pharma.publicationYear}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Country:</span>
                      <span className={styles.metaValue}>{pharma.countriesAssessed}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Products:</span>
                      <span className={styles.metaValue}>{pharma.numberOfProducts}</span>
                    </div>
                  </div>
                  
                  <div className={styles.cardActions}>
                    <span className={styles.viewDetails}>View Details →</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredPharmaceuticals.length === 0 && (
        <div className={styles.noResults}>
          <h3>No results found</h3>
          <p>Try adjusting your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
}