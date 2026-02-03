import { useState } from 'react'
import { CalendarEdit, CalendarTick, DocumentText } from 'iconsax-react'
import { colors } from '../theme'
import MarkAttendanceForm from '../components/attendance/MarkAttendanceForm'
import AttendanceList from '../components/attendance/AttendanceList'
import Tabs from '../components/ui/Tabs'
import { attendance as strings, tabs as tabStrings } from '../content/strings'

const TAB_MARK = 'mark'
const TAB_RECORDS = 'records'

const attendanceTabs = [
  { value: TAB_MARK, label: tabStrings.markAttendance, icon: CalendarEdit },
  { value: TAB_RECORDS, label: tabStrings.records, icon: DocumentText },
]

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState(TAB_MARK)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-text sm:text-2xl">
        <CalendarTick size={28} color={colors.primary} className="shrink-0" />
        {strings.title}
      </h2>
      <Tabs tabs={attendanceTabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === TAB_MARK && (
        <MarkAttendanceForm onMarked={() => setRefreshKey((k) => k + 1)} />
      )}
      {activeTab === TAB_RECORDS && (
        <AttendanceList refreshTrigger={refreshKey} />
      )}
    </div>
  )
}
