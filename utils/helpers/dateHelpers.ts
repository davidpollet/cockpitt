import "dayjs/locale/fr"

import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"

const time = dayjs

time.locale("fr")
time.extend(isToday)
time.extend(isYesterday)
time.extend(relativeTime)
time.extend(updateLocale)

export default time
