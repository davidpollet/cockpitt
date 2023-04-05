import { IconClose } from "src/ui/icons/Close"
import { useFixtures } from "./useFixtures"
import useIsMounted from "src/lib/hooks/useIsMounted"

export function FixtureBanner() {
  const { clearFixtures, closeBanner, injectFixtures, showFixtureBanner } = useFixtures()
  const isMounted = useIsMounted()

  if (!isMounted) return null

  return showFixtureBanner ? (
    <div className="flex items-center gap-3">
      <button className="button is-ghost dark:text-violet-100" onClick={injectFixtures}>
        Injecter les fixtures
      </button>
      <button className="button is-ghost dark:text-violet-100" onClick={clearFixtures}>
        Retirer les fixtures
      </button>
      <button
        className="button is-ghost mr-auto dark:text-violet-100"
        onClick={closeBanner}
      >
        <IconClose className="h-6 w-6" /> <span>Cacher pour cette session</span>
      </button>
    </div>
  ) : null
}
