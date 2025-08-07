import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../Store/Store'
import { markNotificationRead } from '../Store/Reducer/landingPageSlice'
import { useEffect } from 'react'
import ConflictResolutionModal from './ConflictResolutionModal' // ✅ Make sure this is already created

const SmartNotificationCenter = () => {
  const notifications = useSelector((state: RootState) => state.landingPage.notifications)
  const conflict = useSelector((state: RootState) => state.landingPage.conflictResolution)
  const dispatch = useDispatch()


  useEffect(() => {
    const unread = notifications.filter(n => !n.read)
  
    if (unread.length > 0) {
      const timer = setTimeout(() => {
        unread.forEach(n => {
          dispatch(markNotificationRead(n.id))
        });
      }, 3000) // slight delay for rendering + visibility
      return () => clearTimeout(timer)
    }
  }, [notifications, dispatch])
  

  return (
    <>
     
      <div className="fixed top-4 right-4 space-y-3 z-50">
        {notifications
          .filter(n => !n.read)
          .map((notif) => (
            <div
              key={notif.id}
              className={`px-4 py-3 rounded-lg shadow-md text-white ${
                notif.type === 'success'
                  ? 'bg-green-500'
                  : notif.type === 'error'
                  ? 'bg-red-500'
                  : notif.type === 'price'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              }`}
            >
              {notif.message}
            </div>
          ))}
      </div>

      {conflict?.hasConflict && <ConflictResolutionModal />}
    </>
  )
}

export default SmartNotificationCenter
