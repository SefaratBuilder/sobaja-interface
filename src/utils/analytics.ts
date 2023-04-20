import { UaEventOptions } from 'react-ga4/types/ga4'
import ReactGA from 'react-ga4'

export const sendEvent = (event: UaEventOptions) => {
    ReactGA.event(event)
}
