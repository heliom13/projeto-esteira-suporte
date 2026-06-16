import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {ExternalClass} from '../../services/external'
import {Spinner, Title, WarningTitle, WrapImage} from './externalStyles'
import ExternalProcessClient from './client'

const Logo = require('../../assets/images/logo.png')

type ClientProps = {
    id: number
    name: string
    sellerMain: string
    sellerSecondary: string
    stepCurrent: string
    status: string
}

export type ProcessProps = {
    deadline: number
    flow: string
    step: string
}

const ExternalProcess = () => {
    const {externalId} = useParams()
    const [loading, setLoading] = useState(false)
    const [client, setClient] = useState<ClientProps>()
    const [errorMessage, setErrorMessage] = useState(false)

    const fetchData = () => {
        setLoading(true)
        try {
            ExternalClass.externalClient(externalId)
                .then((response) => {
                    setLoading(false)
                    setClient(response.data)
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
                <ExternalProcessClient loading={loading} client={client}/>
            )}
            {errorMessage && <WarningTitle> Processo não encontrado 😔</WarningTitle>}
        </div>
    )
}

export default ExternalProcess
