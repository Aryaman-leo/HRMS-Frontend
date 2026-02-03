import { useState } from 'react'
import { People } from 'iconsax-react'
import { colors } from '../theme'
import EmployeeForm from '../components/employees/EmployeeForm'
import EmployeeList from '../components/employees/EmployeeList'
import BulkImportCsv from '../components/ui/BulkImportCsv'
import { employees as strings } from '../content/strings'

export default function EmployeesPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((k) => k + 1)
  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-text sm:text-2xl">
        <People size={28} color={colors.primary} className="shrink-0" />
        {strings.title}
      </h2>
      <EmployeeForm
        onAdded={refresh}
        extraActions={
          <BulkImportCsv
            endpoint="/api/employees/bulk/csv"
            onSuccess={refresh}
            label={strings.importCsv}
            resultMessage={strings.bulkResult}
          />
        }
      />
      <EmployeeList refreshTrigger={refreshKey} />
    </div>
  )
}
