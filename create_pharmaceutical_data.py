#!/usr/bin/env python3
import csv
import json

def create_pharmaceutical_data():
    # Read the CSV file
    with open('pharmaceuticals_lca_data.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        data = list(reader)
    
    # Create TypeScript file content
    ts_content = '''export interface PharmaceuticalData {
  dataSourceTopic: string;
  title: string;
  authors: string;
  publicationYear: string;
  publicationDate: string;
  healthcareField: string;
  specialty: string;
  citation: string;
  publicationType: string;
  journal: string;
  url: string;
  abstract: string;
  numberOfProducts: string;
  productsAndProcesses: string;
  yearOfDataCollection: string;
  authorInstitutions: string;
  institutionsAssessed: string;
  countriesAssessed: string;
  regionsAssessed: string;
  incomeCategory: string;
  scale: string;
  functionalUnit: string;
  systemBoundary: string;
  includedStages: string;
  impactCategories: string;
  lifeCycleAccountingMethod: string;
  activityDataType: string;
  methodologicalApproach: string;
  standards: string;
  inventoryDatabases: string;
  characterizationModels: string;
  lcaSoftware: string;
  inputOutputModels: string;
  sourceOfFinancialData: string;
  analyses: string;
  competingInterests: string;
  fundingDeclaration: string;
  recordCreatedBy: string;
  recordCreated: string;
  lastModified: string;
  notes: string;
  dataSourceCode: string;
  verificationStatus: string;
  correspondingAuthors: string;
  correspondingAuthorEmail: string;
}

// All 15 pharmaceutical products from the CSV file
export const pharmaceuticalData: PharmaceuticalData[] = [
'''
    
    # Process each row
    for i, row in enumerate(data):
        ts_content += "  {\n"
        
        # Map CSV columns to TypeScript properties
        mappings = {
            'dataSourceTopic': row.get('Data source topic', ''),
            'title': row.get('Title', ''),
            'authors': row.get('Author(s)', ''),
            'publicationYear': row.get('Publication year', ''),
            'publicationDate': row.get('Publication date', ''),
            'healthcareField': row.get('Healthcare field', ''),
            'specialty': row.get('Specialty', ''),
            'citation': row.get('Citation', ''),
            'publicationType': row.get('Publication type', ''),
            'journal': row.get('Journal', ''),
            'url': row.get('URL', ''),
            'abstract': row.get('Abstract', ''),
            'numberOfProducts': row.get('Number of products or processes', ''),
            'productsAndProcesses': row.get('Products and processes studied', ''),
            'yearOfDataCollection': row.get('Year of data collection', ''),
            'authorInstitutions': row.get('Author institution(s)', ''),
            'institutionsAssessed': row.get('Institution(s) assessed', ''),
            'countriesAssessed': row.get('Country(s) assessed', ''),
            'regionsAssessed': row.get('Region(s) assessed', ''),
            'incomeCategory': row.get('Income category of country assessed', ''),
            'scale': row.get('Scale', ''),
            'functionalUnit': row.get('Functional unit', ''),
            'systemBoundary': row.get('System boundary', ''),
            'includedStages': row.get('Included stages or activities', ''),
            'impactCategories': row.get('Impact categories', ''),
            'lifeCycleAccountingMethod': row.get('Life cycle accounting method', ''),
            'activityDataType': row.get('Activity data (Emissions factor type)', ''),
            'methodologicalApproach': row.get('Methodological approach as reported by data source', ''),
            'standards': row.get('Standard(s)', ''),
            'inventoryDatabases': row.get('Inventory database(s)', ''),
            'characterizationModels': row.get('Characterization model(s)', ''),
            'lcaSoftware': row.get('LCA software', ''),
            'inputOutputModels': row.get('Input-output model/database(s)', ''),
            'sourceOfFinancialData': row.get('Source of financial activity data', ''),
            'analyses': row.get('Analyses', ''),
            'competingInterests': row.get('Competing interests statement', ''),
            'fundingDeclaration': row.get('Funding declaration', ''),
            'recordCreatedBy': row.get('Record created by', ''),
            'recordCreated': row.get('Record created', ''),
            'lastModified': row.get('Last Modified', ''),
            'notes': row.get('Notes', ''),
            'dataSourceCode': row.get('Data source code', ''),
            'verificationStatus': row.get('Verification status', ''),
            'correspondingAuthors': row.get('Corresponding author(s)', ''),
            'correspondingAuthorEmail': row.get('Corresponding author\'s email address', '')
        }
        
        # Add each property
        for key, value in mappings.items():
            # Escape quotes and handle empty values
            if value is None or value == '':
                escaped_value = '""'
            else:
                # Escape quotes and backslashes properly
                escaped_value = json.dumps(str(value))
            ts_content += f"    {key}: {escaped_value},\n"
        
        ts_content += "  }"
        if i < len(data) - 1:
            ts_content += ","
        ts_content += "\n"
    
    ts_content += '''];

export function getPharmaceuticalById(id: string): PharmaceuticalData | undefined {
  return pharmaceuticalData.find(item => 
    item.dataSourceTopic.toLowerCase().replace(/\\s+/g, '-') === id
  );
}

export function getAllPharmaceuticals(): PharmaceuticalData[] {
  return pharmaceuticalData;
}
'''
    
    # Write to file
    with open('lib/pharmaceuticalData.ts', 'w', encoding='utf-8') as file:
        file.write(ts_content)
    
    print(f"Created TypeScript data file with {len(data)} pharmaceutical products")

if __name__ == "__main__":
    create_pharmaceutical_data()
