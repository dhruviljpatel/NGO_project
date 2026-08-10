import React, { createContext, useContext, useState, useEffect } from 'react'

const INITIAL_EVENTS = [
  {
    id: "1",
    name: "School Book Distribution",
    date: "25 August 2026",
    location: "Ahmedabad",
    requiredVolunteers: 20,
    registeredVolunteers: 15,
    description: "Distribution of educational materials to students in rural schools.",
    status: "Upcoming",
  },
  {
    id: "2",
    name: "Community Food Drive",
    date: "10 September 2026",
    location: "Surat",
    requiredVolunteers: 50,
    registeredVolunteers: 50,
    description: "Packaging and distributing food to homeless shelters.",
    status: "Full",
  }
]

const INITIAL_VOLUNTEERS = [
  { id: "1", name: "Amit Patel", email: "amit.p@example.com", skills: "Teaching", hours: 45, status: "Active" },
  { id: "2", name: "Priya Shah", email: "priya.s@example.com", skills: "Healthcare", hours: 120, status: "Active" },
  { id: "3", name: "Rahul Desai", email: "rahul.d@example.com", skills: "Event Management", hours: 10, status: "Inactive" },
]

const INITIAL_PROJECTS = [
  { id: "1", name: "Rural Education Initiative", startDate: "2026-07-01", endDate: "2026-12-31", targetBeneficiaries: 500, currentBeneficiaries: 320, status: "Active" },
  { id: "2", name: "City Food Relief", startDate: "2026-08-01", endDate: "2026-10-31", targetBeneficiaries: 1000, currentBeneficiaries: 850, status: "Active" },
]

const INITIAL_DONATIONS = [
  { id: "DON-1029", donor: "John Doe", amount: "$500.00", date: "2026-08-10", project: "Rural Education", status: "Success" },
  { id: "DON-1028", donor: "Sarah Smith", amount: "$150.00", date: "2026-08-09", project: "General Fund", status: "Success" },
  { id: "DON-1027", donor: "Michael Chen", amount: "$1,000.00", date: "2026-08-08", project: "City Food Relief", status: "Pending" },
]

const INITIAL_BENEFICIARIES = [
  { id: "1", name: "Ramesh Kumar", age: 14, location: "Village A", program: "Education", status: "Active" },
  { id: "2", name: "Sita Devi", age: 35, location: "Village B", program: "Women Empowerment", status: "Active" },
  { id: "3", name: "Raju", age: 42, location: "City Slum C", program: "Food Distribution", status: "Completed" },
]

type MockDataContextType = {
  events: any[]
  setEvents: (events: any[]) => void
  volunteers: any[]
  setVolunteers: (volunteers: any[]) => void
  projects: any[]
  setProjects: (projects: any[]) => void
  donations: any[]
  setDonations: (donations: any[]) => void
  beneficiaries: any[]
  setBeneficiaries: (beneficiaries: any[]) => void
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined)

function getLocalData(key: string, initialData: any[]) {
  const item = localStorage.getItem(key)
  if (item) {
    try {
      return JSON.parse(item)
    } catch {
      return initialData
    }
  }
  return initialData
}

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState(() => getLocalData('mock_events', INITIAL_EVENTS))
  const [volunteers, setVolunteers] = useState(() => getLocalData('mock_volunteers', INITIAL_VOLUNTEERS))
  const [projects, setProjects] = useState(() => getLocalData('mock_projects', INITIAL_PROJECTS))
  const [donations, setDonations] = useState(() => getLocalData('mock_donations', INITIAL_DONATIONS))
  const [beneficiaries, setBeneficiaries] = useState(() => getLocalData('mock_beneficiaries', INITIAL_BENEFICIARIES))

  useEffect(() => { localStorage.setItem('mock_events', JSON.stringify(events)) }, [events])
  useEffect(() => { localStorage.setItem('mock_volunteers', JSON.stringify(volunteers)) }, [volunteers])
  useEffect(() => { localStorage.setItem('mock_projects', JSON.stringify(projects)) }, [projects])
  useEffect(() => { localStorage.setItem('mock_donations', JSON.stringify(donations)) }, [donations])
  useEffect(() => { localStorage.setItem('mock_beneficiaries', JSON.stringify(beneficiaries)) }, [beneficiaries])

  return (
    <MockDataContext.Provider value={{
      events, setEvents,
      volunteers, setVolunteers,
      projects, setProjects,
      donations, setDonations,
      beneficiaries, setBeneficiaries,
    }}>
      {children}
    </MockDataContext.Provider>
  )
}

export function useMockData() {
  const context = useContext(MockDataContext)
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider')
  }
  return context
}
