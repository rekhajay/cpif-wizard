import React, { useState, useEffect } from 'react';
import { CosmosService } from './services/cosmosService';
import { EmployeeService } from './services/employeeService';
import { CPIFDocument, Employee } from './types/cpif';

type WizardTab = 'New Client-Entity (Need a CUS#)' | 'Existing Client-Entity (Has a CUS#)' | 'New Client-Individual (Need a CUS#)' | 'Existing Client-Individual (Has a CUS#)';

type IndustryOption = 'Agriculture' | 'Architecture' | 'Arts & Entertainment' | 'Automotive' | 'Banking & Finance' | 'Construction' | 'Education' | 'Energy' | 'Food & Beverage' | 'Government' | 'Healthcare' | 'Hospitality' | 'Insurance' | 'Legal' | 'Manufacturing' | 'Media & Communications' | 'Non-Profit' | 'Real Estate' | 'Retail' | 'Technology' | 'Transportation' | 'Other';

type EntityTypeOption = 'C-Corporation' | 'S-Corporation' | 'Partnership' | 'LLC' | 'LLP' | 'Sole Proprietorship' | 'Trust' | 'Estate' | 'Individual' | 'Other';

type ProductServiceOption = 'Tax Preparation' | 'Tax Planning' | 'Bookkeeping' | 'Payroll' | 'Audit' | 'Consulting' | 'Other';

type LeadSourceOption = 'Referral' | 'Website' | 'Social Media' | 'Advertising' | 'Cold Call' | 'Trade Show' | 'Marketing & Sales Campaign' | 'Web Origin' | 'Referral';

interface WizardProps {
  open: boolean;
  onClose: () => void;
}

export default function Wizard({ open, onClose }: WizardProps) {
  const [selectedTab, setSelectedTab] = useState<WizardTab | ''>('');
  const [currentStep, setCurrentStep] = useState<'tab-selection' | 'single-row'>('tab-selection');
  
  // Services
  const [cosmosService] = useState(new CosmosService());
  const [employeeService] = useState(new EmployeeService());
  
  // Employee data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  
  // Form state
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Form fields
  const [newAccountLegalName, setNewAccountLegalName] = useState('');
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [primaryContactTitle, setPrimaryContactTitle] = useState('');
  const [primaryContactEmail, setPrimaryContactEmail] = useState('');
  const [industry, setIndustry] = useState<IndustryOption | ''>('');
  const [entityType, setEntityType] = useState<EntityTypeOption | ''>('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [productService, setProductService] = useState<ProductServiceOption | ''>('');
  const [estOpptyValue, setEstOpptyValue] = useState('');
  const [opportunityPartner, setOpportunityPartner] = useState('');
  const [taxDeliveryPartner, setTaxDeliveryPartner] = useState('');
  const [bdSalesSupport, setBdSalesSupport] = useState('');
  const [leadSource, setLeadSource] = useState<LeadSourceOption | ''>('');
  const [leadSourceDetails, setLeadSourceDetails] = useState('');
  const [lsFreeText, setLsFreeText] = useState('');
  const [referringEmployee, setReferringEmployee] = useState('');
  
  // Workday Project & Contract fields
  const [needProjectInWorkday, setNeedProjectInWorkday] = useState<'Yes' | 'No' | ''>('');
  const [customerCollectionsLead, setCustomerCollectionsLead] = useState('');
  const [projectDeliveryLead, setProjectDeliveryLead] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [asstProjectManager, setAsstProjectManager] = useState('');
  const [projectBillingSpecialist, setProjectBillingSpecialist] = useState('');
  const [serviceCode, setServiceCode] = useState('');
  const [taxYearEnd, setTaxYearEnd] = useState('');
  const [renewableProject, setRenewableProject] = useState<'Yes' | 'No' | ''>('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [taxForm, setTaxForm] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState('');
  const [contractType, setContractType] = useState('');
  const [totalEstimatedHours, setTotalEstimatedHours] = useState('');
  const [estimatedRealizationYear1, setEstimatedRealizationYear1] = useState('');
  const [contractRateSheet, setContractRateSheet] = useState('');
  const [totalContractAmount, setTotalContractAmount] = useState('');
  const [adminFeePercent, setAdminFeePercent] = useState('');
  const [adminFeeIncludedExcluded, setAdminFeeIncludedExcluded] = useState<'Included' | 'Excluded' | ''>('');
  const [onboardingFeePercent, setOnboardingFeePercent] = useState('');
  const [onboardingFeeAmount, setOnboardingFeeAmount] = useState('');
  const [suggestedWorkdayParentName, setSuggestedWorkdayParentName] = useState('');
  
  // Tax Admin fields
  const [elSigned, setElSigned] = useState<'Yes' | 'No' | ''>('');
  const [authorized7216, setAuthorized7216] = useState<'Yes' | 'No' | ''>('');
  
  // PE & TMS fields
  const [connectedToPEOrTMS, setConnectedToPEOrTMS] = useState('');
  const [nameOfRelatedPEFundTMSCustomer, setNameOfRelatedPEFundTMSCustomer] = useState('');
  
  // Invoice fields
  const [invoiceType, setInvoiceType] = useState('');
  const [consolidatedBillingCustomerName, setConsolidatedBillingCustomerName] = useState('');
  const [consolidatedBillingExistingSchedule, setConsolidatedBillingExistingSchedule] = useState('');
  const [additionalCustomerContacts, setAdditionalCustomerContacts] = useState('');
  const [additionalCustomerContactEmails, setAdditionalCustomerContactEmails] = useState('');
  const [invoiceRecipientNames, setInvoiceRecipientNames] = useState('');
  const [invoiceRecipientEmails, setInvoiceRecipientEmails] = useState('');
  
  // Engagement Letter fields
  const [partnerSigningEL, setPartnerSigningEL] = useState('');
  const [consultingServicesDescription, setConsultingServicesDescription] = useState('');
  
  // Pete Klinger fields
  const [documentDelivery, setDocumentDelivery] = useState('');
  const [invoiceMemo, setInvoiceMemo] = useState('');
  const [billToContact, setBillToContact] = useState('');
  
  // Revenue Forecast
  const [revenueForecast, setRevenueForecast] = useState<Record<string, string>>({});
  
  // Onboarding fields
  const [accountGUID, setAccountGUID] = useState('');
  const [opportunityGUID, setOpportunityGUID] = useState('');
  const [opportunityName, setOpportunityName] = useState('');

  const industryOptions: IndustryOption[] = [
    'Agriculture',
    'Architecture',
    'Arts & Entertainment',
    'Automotive',
    'Banking & Finance',
    'Construction',
    'Education',
    'Energy',
    'Food & Beverage',
    'Government',
    'Healthcare',
    'Hospitality',
    'Insurance',
    'Legal',
    'Manufacturing',
    'Media & Communications',
    'Non-Profit',
    'Real Estate',
    'Retail',
    'Technology',
    'Transportation',
    'Other'
  ];

  const entityTypeOptions: EntityTypeOption[] = [
    'C-Corporation',
    'S-Corporation',
    'Partnership',
    'LLC',
    'LLP',
    'Sole Proprietorship',
    'Trust',
    'Estate',
    'Individual',
    'Other'
  ];

  const productServiceOptions: ProductServiceOption[] = [
    'Tax Preparation',
    'Tax Planning',
    'Bookkeeping',
    'Payroll',
    'Audit',
    'Consulting',
    'Other'
  ];

  const leadSourceOptions: LeadSourceOption[] = [
    'Referral',
    'Website',
    'Social Media',
    'Advertising',
    'Cold Call',
    'Trade Show',
    'Marketing & Sales Campaign',
    'Web Origin',
    'Referral'
  ];

  const handleTabSelection = (tab: WizardTab) => {
    setSelectedTab(tab);
    setCurrentStep('single-row');
  };

  const handleBack = () => {
    if (currentStep === 'single-row') {
      setCurrentStep('tab-selection');
      setSelectedTab('');
    }
  };

  // Load employees on component mount
  useEffect(() => {
    if (open && currentStep === 'single-row') {
      loadEmployees();
    }
  }, [open, currentStep]);

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const empData = await employeeService.getEmployees();
      setEmployees(empData);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleNext = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Create CPIF document
      const cpifDocument: CPIFDocument = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        createdBy: 'current-user-id', // This would come from Azure AD
        wizardType: selectedTab as any,
        status: 'Draft',
        lastModified: new Date(),
        version: 1,
        
        accountInfo: {
          legalName: newAccountLegalName,
          primaryContact: primaryContactName,
          primaryContactTitle: primaryContactTitle,
          primaryContactEmail: primaryContactEmail,
          industry: industry,
          entityType: entityType,
          address: address,
          city: city,
          state: state,
          zipCode: zipCode,
          productService: productService,
          estOpptyValue: estOpptyValue,
          opportunityPartner: getEmployeeById(opportunityPartner),
          taxDeliveryPartner: getEmployeeById(taxDeliveryPartner),
          bdSalesSupport: bdSalesSupport,
          leadSource: leadSource,
          leadSourceDetails: leadSourceDetails,
          lsFreeText: lsFreeText,
          referringEmployee: referringEmployee ? getEmployeeById(referringEmployee) : undefined
        },
        
        workdayInfo: {
          needProjectInWorkday: needProjectInWorkday === 'Yes',
          customerCollectionsLead: getEmployeeById(customerCollectionsLead),
          projectDeliveryLead: getEmployeeById(projectDeliveryLead),
          projectManager: getEmployeeById(projectManager),
          asstProjectManager: getEmployeeById(asstProjectManager),
          projectBillingSpecialist: getEmployeeById(projectBillingSpecialist),
          serviceCode: serviceCode,
          taxYearEnd: taxYearEnd,
          renewableProject: renewableProject === 'Yes',
          projectStartDate: projectStartDate,
          projectEndDate: projectEndDate,
          taxForm: taxForm,
          nextDueDate: nextDueDate,
          dateOfDeath: dateOfDeath,
          contractType: contractType,
          totalEstimatedHours: parseFloat(totalEstimatedHours) || 0,
          estimatedRealizationYear1: estimatedRealizationYear1,
          contractRateSheet: contractRateSheet,
          totalContractAmount: parseFloat(totalContractAmount) || 0,
          adminFeePercent: adminFeePercent,
          adminFeeIncludedExcluded: adminFeeIncludedExcluded as 'Included' | 'Excluded',
          onboardingFeePercent: onboardingFeePercent,
          onboardingFeeAmount: parseFloat(onboardingFeeAmount) || 0,
          suggestedWorkdayParentName: suggestedWorkdayParentName
        },
        
        taxAdmin: {
          elSigned: elSigned === 'Yes',
          authorized7216: authorized7216 === 'Yes'
        },
        
        peTms: {
          connectedToPEOrTMS: connectedToPEOrTMS,
          nameOfRelatedPEFundTMSCustomer: nameOfRelatedPEFundTMSCustomer
        },
        
        invoice: {
          invoiceType: invoiceType,
          consolidatedBillingCustomerName: consolidatedBillingCustomerName,
          consolidatedBillingExistingSchedule: consolidatedBillingExistingSchedule,
          additionalCustomerContacts: additionalCustomerContacts,
          additionalCustomerContactEmails: additionalCustomerContactEmails,
          invoiceRecipientNames: invoiceRecipientNames,
          invoiceRecipientEmails: invoiceRecipientEmails
        },
        
        engagement: {
          partnerSigningEL: partnerSigningEL,
          consultingServicesDescription: consultingServicesDescription
        },
        
        peteKlinger: {
          documentDelivery: documentDelivery,
          invoiceMemo: invoiceMemo,
          billToContact: billToContact
        },
        
        revenueForecast: revenueForecast,
        
        onboarding: {
          accountGUID: accountGUID,
          opportunityGUID: opportunityGUID,
          opportunityName: opportunityName
        }
      };

      // Save to Cosmos DB
      await cosmosService.saveCPIF(cpifDocument);
      
      setSaveStatus('saved');
      alert(`CPIF form saved successfully!\nID: ${cpifDocument.id}\nStatus: ${cpifDocument.status}`);
      
    } catch (error) {
      console.error('Failed to save CPIF:', error);
      setSaveStatus('error');
      alert('Failed to save CPIF form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getEmployeeById = (employeeId: string): Employee => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee || {
      id: employeeId,
      displayName: 'Unknown Employee',
      email: '',
      jobTitle: '',
      department: ''
    };
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative max-h-[90vh] w-[95vw] overflow-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">CPIF Creation Wizard</h2>
          <button
            className="rounded-xl border px-4 py-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {currentStep === 'tab-selection' && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Select Wizard Type</h3>
              <p className="mb-6 text-sm text-gray-600">
                Choose the type of CPIF creation wizard you need:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                className="rounded-xl border-2 border-gray-200 bg-white p-6 text-left hover:border-amber-500 hover:bg-amber-50"
                onClick={() => handleTabSelection('New Client-Entity (Need a CUS#)')}
              >
                <h4 className="mb-2 text-lg font-semibold">New Client-Entity (Need a CUS#)</h4>
                <p className="text-sm text-gray-600">Create a new client entity that needs a Customer ID</p>
              </button>

              <button
                className="rounded-xl border-2 border-gray-200 bg-white p-6 text-left hover:border-amber-500 hover:bg-amber-50"
                onClick={() => handleTabSelection('Existing Client-Entity (Has a CUS#)')}
              >
                <h4 className="mb-2 text-lg font-semibold">Existing Client-Entity (Has a CUS#)</h4>
                <p className="text-sm text-gray-600">Work with an existing client entity</p>
              </button>

              <button
                className="rounded-xl border-2 border-gray-200 bg-white p-6 text-left hover:border-amber-500 hover:bg-amber-50"
                onClick={() => handleTabSelection('New Client-Individual (Need a CUS#)')}
              >
                <h4 className="mb-2 text-lg font-semibold">New Client-Individual (Need a CUS#)</h4>
                <p className="text-sm text-gray-600">Create a new individual client</p>
              </button>

              <button
                className="rounded-xl border-2 border-gray-200 bg-white p-6 text-left hover:border-amber-500 hover:bg-amber-50"
                onClick={() => handleTabSelection('Existing Client-Individual (Has a CUS#)')}
              >
                <h4 className="mb-2 text-lg font-semibold">Existing Client-Individual (Has a CUS#)</h4>
                <p className="text-sm text-gray-600">Work with an existing individual client</p>
              </button>
            </div>
          </div>
        )}

        {currentStep === 'single-row' && selectedTab === 'New Client-Entity (Need a CUS#)' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-base font-semibold text-red-600">CPIF Creation Wizard - Single Row View</h4>
                <p className="text-sm text-gray-600 mt-1">← Scroll horizontally to see all fields →</p>
                {saveStatus === 'saving' && <p className="text-sm text-blue-600 mt-1">💾 Saving...</p>}
                {saveStatus === 'saved' && <p className="text-sm text-green-600 mt-1">✅ Saved successfully!</p>}
                {saveStatus === 'error' && <p className="text-sm text-red-600 mt-1">❌ Save failed</p>}
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-xl bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
                  onClick={handleNext}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save CPIF'}
                </button>
                <button
                  className="rounded-xl border px-4 py-2"
                  onClick={() => setCurrentStep('tab-selection')}
                >
                  Back to Tab Selection
                </button>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-visible border border-gray-200 rounded-lg p-2" style={{ 
              scrollbarWidth: 'auto', 
              scrollbarColor: '#cbd5e1 #f1f5f9', 
              maxHeight: '70vh',
              overflowX: 'scroll',
              overflowY: 'auto'
            }}>
              <div className="space-y-4" style={{ minWidth: '3000px', width: '3000px' }}>
                {/* Create Account and Opportunity &/Or Workday Customer */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">Create Account and Opportunity &/Or Workday Customer</h5>
                  <div className="grid grid-cols-8 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">New Account Legal Name</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={newAccountLegalName} onChange={(e) => setNewAccountLegalName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Primary Contact Name</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={primaryContactName} onChange={(e) => setPrimaryContactName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Primary Contact Title</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={primaryContactTitle} onChange={(e) => setPrimaryContactTitle(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Primary Contact Email</label>
                      <input type="email" className="w-full text-xs border px-2 py-1 rounded" value={primaryContactEmail} onChange={(e) => setPrimaryContactEmail(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Industry</label>
                      <select className="w-full text-xs border px-2 py-1 rounded" value={industry} onChange={(e) => setIndustry(e.target.value as IndustryOption)}>
                        <option value="">Select</option>
                        {industryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Entity Type</label>
                      <select className="w-full text-xs border px-2 py-1 rounded" value={entityType} onChange={(e) => setEntityType(e.target.value as EntityTypeOption)}>
                        <option value="">Select</option>
                        {entityTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Address</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">City</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">State</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={state} onChange={(e) => setState(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Zip Code</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Product/Service</label>
                      <select className="w-full text-xs border px-2 py-1 rounded" value={productService} onChange={(e) => setProductService(e.target.value as ProductServiceOption)}>
                        <option value="">Select</option>
                        {productServiceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Est. Oppty Value</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={estOpptyValue} onChange={(e) => setEstOpptyValue(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Opportunity Partner</label>
                      <select 
                        className="w-full text-xs border px-2 py-1 rounded" 
                        value={opportunityPartner} 
                        onChange={(e) => setOpportunityPartner(e.target.value)}
                        disabled={loadingEmployees}
                      >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.displayName} ({emp.jobTitle})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Tax Delivery Partner</label>
                      <select 
                        className="w-full text-xs border px-2 py-1 rounded" 
                        value={taxDeliveryPartner} 
                        onChange={(e) => setTaxDeliveryPartner(e.target.value)}
                        disabled={loadingEmployees}
                      >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.displayName} ({emp.jobTitle})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">BD/Sales Support</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={bdSalesSupport} onChange={(e) => setBdSalesSupport(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Lead Source</label>
                      <select className="w-full text-xs border px-2 py-1 rounded" value={leadSource} onChange={(e) => setLeadSource(e.target.value as LeadSourceOption)}>
                        <option value="">Select</option>
                        {leadSourceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Lead Source Details</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={leadSourceDetails} onChange={(e) => setLeadSourceDetails(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">LS Free Text</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={lsFreeText} onChange={(e) => setLsFreeText(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Referring Employee</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={referringEmployee} onChange={(e) => setReferringEmployee(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Workday Project & Contract */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">Workday Project & Contract (Time Entry & Pricing)</h5>
                  <div className="grid grid-cols-8 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Need Project in Workday?</label>
                      <select className="w-full text-xs border px-2 py-1 rounded" value={needProjectInWorkday} onChange={(e) => setNeedProjectInWorkday(e.target.value as 'Yes' | 'No' | '')}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Customer Collections Lead</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={customerCollectionsLead} onChange={(e) => setCustomerCollectionsLead(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Project Delivery Lead</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={projectDeliveryLead} onChange={(e) => setProjectDeliveryLead(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Project Manager</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={projectManager} onChange={(e) => setProjectManager(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Asst. Project Manager</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={asstProjectManager} onChange={(e) => setAsstProjectManager(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Project Billing Specialist</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={projectBillingSpecialist} onChange={(e) => setProjectBillingSpecialist(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Service Code</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={serviceCode} onChange={(e) => setServiceCode(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Tax Year End</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={taxYearEnd} onChange={(e) => setTaxYearEnd(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Renewable Project?</label>
                      <select className="w-full text-xs border px-2 py-1 rounded" value={renewableProject} onChange={(e) => setRenewableProject(e.target.value as 'Yes' | 'No' | '')}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Project Start Date</label>
                      <input type="date" className="w-full text-xs border px-2 py-1 rounded" value={projectStartDate} onChange={(e) => setProjectStartDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Project End Date</label>
                      <input type="date" className="w-full text-xs border px-2 py-1 rounded" value={projectEndDate} onChange={(e) => setProjectEndDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Tax Form</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={taxForm} onChange={(e) => setTaxForm(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Next Due Date</label>
                      <input type="date" className="w-full text-xs border px-2 py-1 rounded" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Date of Death</label>
                      <input type="date" className="w-full text-xs border px-2 py-1 rounded" value={dateOfDeath} onChange={(e) => setDateOfDeath(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Contract Type</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={contractType} onChange={(e) => setContractType(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Total Estimated Hours</label>
                      <input type="number" className="w-full text-xs border px-2 py-1 rounded" value={totalEstimatedHours} onChange={(e) => setTotalEstimatedHours(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Estimated Realization Year 1</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={estimatedRealizationYear1} onChange={(e) => setEstimatedRealizationYear1(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Contract Rate Sheet</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={contractRateSheet} onChange={(e) => setContractRateSheet(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Total Contract Amount</label>
                      <input type="number" className="w-full text-xs border px-2 py-1 rounded" value={totalContractAmount} onChange={(e) => setTotalContractAmount(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Admin Fee %</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={adminFeePercent} onChange={(e) => setAdminFeePercent(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Admin Fee Included/Excluded</label>
                      <select className="w-full text-xs border px-2 py-1 rounded" value={adminFeeIncludedExcluded} onChange={(e) => setAdminFeeIncludedExcluded(e.target.value as 'Included' | 'Excluded' | '')}>
                        <option value="">Select</option>
                        <option value="Included">Included</option>
                        <option value="Excluded">Excluded</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Onboarding Fee %</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={onboardingFeePercent} onChange={(e) => setOnboardingFeePercent(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Onboarding Fee Amount</label>
                      <input type="number" className="w-full text-xs border px-2 py-1 rounded" value={onboardingFeeAmount} onChange={(e) => setOnboardingFeeAmount(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Suggested Workday Parent Name</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={suggestedWorkdayParentName} onChange={(e) => setSuggestedWorkdayParentName(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* FOR TAX ADMIN ONLY */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">FOR TAX ADMIN ONLY</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">EL Signed?</label>
                      <select className="w-full text-xs border px-2 py-1 rounded" value={elSigned} onChange={(e) => setElSigned(e.target.value as 'Yes' | 'No' | '')}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">7216 Authorized?</label>
                      <select className="w-full text-xs border px-2 py-1 rounded" value={authorized7216} onChange={(e) => setAuthorized7216(e.target.value as 'Yes' | 'No' | '')}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* FOR PE & TMS ONLY */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">FOR PE & TMS ONLY</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Connected to PE or TMS?</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={connectedToPEOrTMS} onChange={(e) => setConnectedToPEOrTMS(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Name of Related PE Fund/TMS Customer</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={nameOfRelatedPEFundTMSCustomer} onChange={(e) => setNameOfRelatedPEFundTMSCustomer(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Invoice Style & Delivery */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">Invoice Style & Delivery</h5>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Invoice Type</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={invoiceType} onChange={(e) => setInvoiceType(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Consolidated Billing Customer</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={consolidatedBillingCustomerName} onChange={(e) => setConsolidatedBillingCustomerName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Consolidated Billing Schedule</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={consolidatedBillingExistingSchedule} onChange={(e) => setConsolidatedBillingExistingSchedule(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Add'l Customer Contacts</label>
                      <textarea className="w-full text-xs border px-2 py-1 rounded" rows={2} value={additionalCustomerContacts} onChange={(e) => setAdditionalCustomerContacts(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Add'l Customer Contact Emails</label>
                      <textarea className="w-full text-xs border px-2 py-1 rounded" rows={2} value={additionalCustomerContactEmails} onChange={(e) => setAdditionalCustomerContactEmails(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Invoice Recipient Names</label>
                      <textarea className="w-full text-xs border px-2 py-1 rounded" rows={2} value={invoiceRecipientNames} onChange={(e) => setInvoiceRecipientNames(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Invoice Recipient Emails</label>
                      <textarea className="w-full text-xs border px-2 py-1 rounded" rows={2} value={invoiceRecipientEmails} onChange={(e) => setInvoiceRecipientEmails(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Engagement Letter */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">Engagement Letter</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Partner Signing EL</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={partnerSigningEL} onChange={(e) => setPartnerSigningEL(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Consulting Services Description</label>
                      <textarea className="w-full text-xs border px-2 py-1 rounded" rows={2} value={consultingServicesDescription} onChange={(e) => setConsultingServicesDescription(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* FOR PETE KLINGER ONLY */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">FOR PETE KLINGER ONLY</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Document Delivery</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={documentDelivery} onChange={(e) => setDocumentDelivery(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Invoice Memo</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={invoiceMemo} onChange={(e) => setInvoiceMemo(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Bill-To Contact</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={billToContact} onChange={(e) => setBillToContact(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Revenue Forecast By Month */}
                <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">Revenue Forecast By Month</h5>
                  <div className="text-sm text-red-600 mb-2">Using the Total Contract Amount, indicate the timing of WIP production over a 12-month period.</div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="border px-1 py-1">Sep-2025</th>
                          <th className="border px-1 py-1">Oct-2025</th>
                          <th className="border px-1 py-1">Nov-2025</th>
                          <th className="border px-1 py-1">Dec-2025</th>
                          <th className="border px-1 py-1">Jan-2026</th>
                          <th className="border px-1 py-1">Feb-2026</th>
                          <th className="border px-1 py-1">Mar-2026</th>
                          <th className="border px-1 py-1">Apr-2026</th>
                          <th className="border px-1 py-1">May-2026</th>
                          <th className="border px-1 py-1">Jun-2026</th>
                          <th className="border px-1 py-1">Jul-2026</th>
                          <th className="border px-1 py-1">Aug-2026</th>
                          <th className="border px-1 py-1">Balance</th>
                        </tr>
                        <tr className="bg-white">
                          <th className="border px-1 py-1">Month 1</th>
                          <th className="border px-1 py-1">Month 2</th>
                          <th className="border px-1 py-1">Month 3</th>
                          <th className="border px-1 py-1">Month 4</th>
                          <th className="border px-1 py-1">Month 5</th>
                          <th className="border px-1 py-1">Month 6</th>
                          <th className="border px-1 py-1">Month 7</th>
                          <th className="border px-1 py-1">Month 8</th>
                          <th className="border px-1 py-1">Month 9</th>
                          <th className="border px-1 py-1">Month 10</th>
                          <th className="border px-1 py-1">Month 11</th>
                          <th className="border px-1 py-1">Month 12</th>
                          <th className="border px-1 py-1">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 3 }, (_, rowIndex) => (
                          <tr key={rowIndex}>
                            {Array.from({ length: 13 }, (_, colIndex) => {
                              const cellKey = `${rowIndex}-${colIndex}`;
                              return (
                                <td key={colIndex} className="border border-gray-300 bg-pink-50">
                                  <input
                                    type="text"
                                    className="w-full border-0 bg-transparent px-1 py-1 text-xs focus:bg-white focus:outline-none"
                                    value={revenueForecast[cellKey] || ''}
                                    onChange={(e) => setRevenueForecast(prev => ({ ...prev, [cellKey]: e.target.value }))}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* FOR ONBOARDING ONLY */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-red-600 mb-4">FOR ONBOARDING ONLY</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Account GUID</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={accountGUID} onChange={(e) => setAccountGUID(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Opportunity GUID</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={opportunityGUID} onChange={(e) => setOpportunityGUID(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Opportunity Name</label>
                      <input type="text" className="w-full text-xs border px-2 py-1 rounded" value={opportunityName} onChange={(e) => setOpportunityName(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'single-row' && selectedTab !== 'New Client-Entity (Need a CUS#)' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-semibold text-red-600">CPIF Creation Wizard - Single Row View</h4>
              <button
                className="rounded-xl border px-4 py-2"
                onClick={() => setCurrentStep('tab-selection')}
              >
                Back to Tab Selection
              </button>
            </div>
            <div className="text-center text-gray-600">
              <p>This tab selection will have its own custom wizard layout.</p>
              <p>For now, showing the "New Client-Entity (Need a CUS#)" layout as an example.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
