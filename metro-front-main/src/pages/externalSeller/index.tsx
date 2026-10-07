import {useEffect, useState} from 'react'
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary'
import {useParams} from 'react-router-dom'
import {ExternalClass} from '../../services/external'
import {Spinner, WarningTitle, WrapImage} from '../externalProcess/externalStyles'
import SuporteLogo from '../../components/brand/SuporteLogo'
import ExternalSeller from './externalSeller'


type SellerProps = {
    id: number
    name: string
    client: string
    property: string
    stepCurrent: string
    statusCurrent: string
    status: string
}

const ExternalSaleSeller = () => {
    const {externalId} = useParams()
    const [loading, setLoading] = useState(false)
    const [seller, setSeller] = useState<SellerProps>()
    const [errorMessage, setErrorMessage] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            await ExternalClass.externalSeller(externalId)
                .then((response) => {
                    setLoading(false)
                    setSeller(response.data)
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
            </WrapImage>{' '}
            {loading ? (
                <Spinner/>
            ) : (
                <ErrorBoundary><ExternalSeller loading={loading} sellers={seller}/></ErrorBoundary>
            )}
            {errorMessage && <WarningTitle> Processo não encontrado 😔 </WarningTitle>}
        </div>
    )
}

export default ExternalSaleSeller
