import { useState } from 'react'
import { Buildings2   } from 'iconsax-react'
import { colors } from '../theme'
import DepartmentForm from '../components/departments/DepartmentForm'
import DepartmentList from '../components/departments/DepartmentList'
import { departments as strings } from '../content/strings'

export default function DepartmentsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <div className="space-y-8">
      <h2 className="flex items-center gap-2 text-2xl font-semibold text-text">
        <Buildings2 size={28} color={colors.primary} className="shrink-0" />
        {strings.title}
      </h2>
      <DepartmentForm onAdded={() => setRefreshKey((k) => k + 1)} />
      <DepartmentList refreshTrigger={refreshKey} />
    </div>
  )
}
