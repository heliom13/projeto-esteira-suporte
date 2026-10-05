import {useEffect, useState} from 'react'
import {ExternalTimelineComponent} from '../../components/timeline/externalTimeLine'
import {Spinner} from '../externalProcess/externalStyles'

const ExternalProcessSteps = ({loading, processData}) => {
    const [process, setProcess] = useState([processData])

    useEffect(() => {
        setProcess(processData)
    }, [processData])

    return (
        <div>
            {loading ? (
                <Spinner/>
            ) : (
                <ExternalTimelineComponent steps={process}/>
            )}
        </div>
    )
}

export default ExternalProcessSteps
