import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {ExternalClass} from '../../services/external'
import {Spinner, Title, WarningTitle, WrapImage} from '../externalProcess/externalStyles'
import ExternalProperty from './externalProperty'

const Logo = require('../../assets/images/logo.png')
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
                <img
                    src={Logo}
                    alt="Logo"
                    style={{
                        width: '50px',
                    }}
                />
                <Title>Suporte Imobiliário</Title>
            </WrapImage>
            {loading ? (
                <Spinner/>
            ) : (
                <ExternalProperty loading={loading} property={property}/>
            )}
            {errorMessage && <WarningTitle> Processo não encontrado 😔 </WarningTitle>}
        </div>
    )
}

export default ExternalProcessProperty
