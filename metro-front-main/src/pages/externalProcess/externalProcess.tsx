import {useEffect, useState} from 'react'
import {ExternalTimelineComponent} from '../../components/timeline/externalTimeLine'

import {Spinner} from './externalStyles'

const ExternalProcessSteps = ({loading, processData}) => {
    const [process, setProcess] = useState([processData])

    useEffect(() => {
        setProcess(processData)
    }, [processData])

    return (
        <>
            {loading ? (
                <Spinner/>
            ) : (
                <ExternalTimelineComponent process={process} steps={process}/>
            )}
        </>
    )
}

export default ExternalProcessSteps
