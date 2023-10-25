import { Container, ModalContent, ModalText, ModalTitle, ModalWrapper } from "../Modal.styled"


export const FiberOpticModal = () => {
    return <ModalWrapper>
        <ModalContent>
            <Container>
                <ModalTitle>Сигнал</ModalTitle>
                <ModalText>Інше</ModalText>
            </Container>
            <Container>
                <ModalTitle>Додаткова інформація</ModalTitle>
                <ModalText>Інше</ModalText>
            </Container>
        </ModalContent>
    </ModalWrapper>
}