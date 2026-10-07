import {useEffect, useState} from 'react'
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary'
import {useParams} from 'react-router-dom'
import {ExternalClass} from '../../services/external'
import {Spinner, WarningTitle, WrapImage} from '../externalProcess/externalStyles'
import SuporteLogo from '../../components/brand/SuporteLogo'
import ExternalProperty from './externalProperty'

type PropertyProps = {
    id: number
    name: string
    sellerMain: string
    sellerSecondary: string
    stepCurrent: string
    statusCurrent: string
    status: string
}

const ExternalProcessProperty = () => {
    const {externalId} = useParams()
    const [loading, setLoading] = useState(false)
    const [property, setProperty] = useState<PropertyProps>()
    const [errorMessage, setErrorMessage] = useState(false)

    const fetchData = () => {
        setLoading(true)
        try {
            ExternalClass.externalProperty(externalId)
                .then((response) => {
                    setLoading(false)
                    setProperty(response.data)
                })
                .catch((error) => {
                    setLoading(false)
                    setErrorMessage(true)
                })
        } catch (error) {
            setLoading(false)
            setErrorMessage(true)
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <WrapImage>
                <SuporteLogo/>
            </WrapImage>
            {loading ? (
                <Spinner/>
            ) : (
                <ErrorBoundary><ExternalProperty loading={loading} property={property}/></ErrorBoundary>
            )}
            {errorMessage && <WarningTitle> Processo não encontrado 😔 </WarningTitle>}
        </div>
    )
}

export default ExternalProcessProperty
