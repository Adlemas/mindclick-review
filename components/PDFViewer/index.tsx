
interface PDFViewerProps {
    fileURL: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileURL }) => {


    return (
        <iframe style={{
            flex: 1,
            width: '100%',
            height: '100%'
        }} src={fileURL} title={fileURL.split('/').pop()} />
    )
}

export default PDFViewer