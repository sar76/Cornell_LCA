import { useRouter } from 'next/router';
import Link from 'next/link';
import { getPharmaceuticalById, getHotspotInfo, calculateLifecycleEmissions } from '../../lib/pharmaceuticalData';
import LifecycleEmissionsChart from '../../components/LifecycleEmissionsChart';
import styles from '../../styles/PharmaceuticalDetail.module.css';

export default function PharmaceuticalDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const pharmaceutical = id ? getPharmaceuticalById(id as string) : null;

  if (!pharmaceutical) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>Pharmaceutical Not Found</h1>
          <p>The pharmaceutical you're looking for doesn't exist.</p>
          <Link href="/" className={styles.backButton}>
            ← Back to Directory
          </Link>
        </div>
      </div>
    );
  }

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
        <Link href="/" className={styles.backButton}>
          ← Back to Directory
        </Link>
        
        <div className={styles.badges}>
          <div 
            className={styles.categoryBadge}
            style={{ backgroundColor: getCategoryColor(pharmaceutical.healthcareField) }}
          >
            {pharmaceutical.healthcareField}
          </div>
          <div 
            className={styles.specialtyBadge}
            style={{ backgroundColor: getSpecialtyColor(pharmaceutical.specialty) }}
          >
            {pharmaceutical.specialty}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <h1 className={styles.title}>{pharmaceutical.dataSourceTopic}</h1>
          
          <div className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>Carbon Emissions Profile</h2>
            <div className={styles.chartContainer}>
              <LifecycleEmissionsChart 
                emissions={calculateLifecycleEmissions(
                  pharmaceutical.includedStages,
                  pharmaceutical.healthcareField,
                  pharmaceutical.specialty
                )} 
              />
            </div>
          </div>
          
          <div className={styles.studyInfo}>
            <h2 className={styles.sectionTitle}>Study Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Title:</span>
                <span className={styles.infoValue}>{pharmaceutical.title}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Authors:</span>
                <span className={styles.infoValue}>{pharmaceutical.authors}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Journal:</span>
                <span className={styles.infoValue}>{pharmaceutical.journal}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Publication Year:</span>
                <span className={styles.infoValue}>{pharmaceutical.publicationYear}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Publication Date:</span>
                <span className={styles.infoValue}>{pharmaceutical.publicationDate}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Publication Type:</span>
                <span className={styles.infoValue}>{pharmaceutical.publicationType}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>DOI:</span>
                <a href={pharmaceutical.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {pharmaceutical.url}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.abstract}>
            <h2 className={styles.sectionTitle}>Abstract</h2>
            <p className={styles.abstractText}>{pharmaceutical.abstract}</p>
          </div>

          <div className={styles.products}>
            <h2 className={styles.sectionTitle}>Products and Processes Studied</h2>
            <div className={styles.productsList}>
              {pharmaceutical.productsAndProcesses.split(';').map((product, index) => (
                <div key={index} className={styles.productItem}>
                  <span className={styles.productNumber}>{index + 1}.</span>
                  <span className={styles.productName}>{product.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.methodology}>
            <h2 className={styles.sectionTitle}>Methodology</h2>
            <div className={styles.methodologyGrid}>
              <div className={styles.methodologyItem}>
                <span className={styles.methodologyLabel}>Methodological Approach:</span>
                <span className={styles.methodologyValue}>{pharmaceutical.methodologicalApproach}</span>
              </div>
              <div className={styles.methodologyItem}>
                <span className={styles.methodologyLabel}>Life Cycle Accounting Method:</span>
                <span className={styles.methodologyValue}>{pharmaceutical.lifeCycleAccountingMethod}</span>
              </div>
              <div className={styles.methodologyItem}>
                <span className={styles.methodologyLabel}>Standards:</span>
                <span className={styles.methodologyValue}>{pharmaceutical.standards}</span>
              </div>
              <div className={styles.methodologyItem}>
                <span className={styles.methodologyLabel}>System Boundary:</span>
                <span className={styles.methodologyValue}>{pharmaceutical.systemBoundary}</span>
              </div>
              <div className={styles.methodologyItem}>
                <span className={styles.methodologyLabel}>Functional Unit:</span>
                <span className={styles.methodologyValue}>{pharmaceutical.functionalUnit}</span>
              </div>
              <div className={styles.methodologyItem}>
                <span className={styles.methodologyLabel}>LCA Software:</span>
                <span className={styles.methodologyValue}>{pharmaceutical.lcaSoftware}</span>
              </div>
            </div>
          </div>

          <div className={styles.impactCategories}>
            <h2 className={styles.sectionTitle}>Impact Categories</h2>
            <div className={styles.impactList}>
              {pharmaceutical.impactCategories.split(';').map((impact, index) => (
                <span key={index} className={styles.impactTag}>
                  {impact.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.stages}>
            <h2 className={styles.sectionTitle}>Included Stages or Activities</h2>
            <div className={styles.stagesList}>
              {pharmaceutical.includedStages.split(';').map((stage, index) => (
                <span key={index} className={styles.stageTag}>
                  {stage.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.hotspotCard}>
            <h3 className={styles.hotspotTitle}>HotSpot</h3>
            <div className={styles.hotspotContent}>
              <p className={styles.hotspotText}>
                {getHotspotInfo(pharmaceutical)}
              </p>
            </div>
          </div>
          
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Study Details</h3>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Number of Products:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.numberOfProducts}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Year of Data Collection:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.yearOfDataCollection}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Countries Assessed:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.countriesAssessed}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Regions Assessed:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.regionsAssessed}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Income Category:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.incomeCategory}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Scale:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.scale}</span>
              </div>
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Technical Details</h3>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Inventory Databases:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.inventoryDatabases}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Characterization Models:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.characterizationModels}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Analyses:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.analyses}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Data Source Code:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.dataSourceCode}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Verification Status:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.verificationStatus}</span>
              </div>
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Contact Information</h3>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Corresponding Authors:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.correspondingAuthors}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Email:</span>
                <a href={`mailto:${pharmaceutical.correspondingAuthorEmail}`} className={styles.link}>
                  {pharmaceutical.correspondingAuthorEmail}
                </a>
              </div>
            </div>
          </div>

          {pharmaceutical.notes && (
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Notes</h3>
              <div className={styles.sidebarContent}>
                <p className={styles.notesText}>{pharmaceutical.notes}</p>
              </div>
            </div>
          )}

          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Funding & Conflicts</h3>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Funding Declaration:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.fundingDeclaration}</span>
              </div>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarLabel}>Competing Interests:</span>
                <span className={styles.sidebarValue}>{pharmaceutical.competingInterests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
