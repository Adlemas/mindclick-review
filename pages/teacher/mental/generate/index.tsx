import {
    Button,
    Checkbox,
    Dropdown,
    Form,
    InputNumber,
    Layout,
    Menu,
    Typography,
} from "antd"
import { Content } from "antd/lib/layout/layout"
import Sider from "antd/lib/layout/Sider"
import { useState } from "react"
import axios from "api/axios"
import DiapasonMenu from "components/DiapasonMenu"
import FormulaMenu from "components/FormulaMenu"
import PDFViewer from "components/PDFViewer"
import DashboardLayout from "container/DashboardLayout"
import { CountFormula } from "types"
import formulaName from "utils/formulaName"
import handleAxiosError from "utils/handleAxiosError"
import styles from "./styles.module.scss"

export type MentalDocumentValues = {
    terms: number
    min: number
    max: number
    formula: CountFormula
    forceFormula: boolean
    pageCount: number
    hCount: number
    vCount: number
    byRows: number
    orientation: "p" | "l"
    fileFormat: "pdf" | "excel"
    isAutoHeight: boolean
    byPage: boolean
    isGrow: boolean
    isGrowByRows: boolean
    withRight: boolean
    design: boolean
}

const initialValues: MentalDocumentValues = {
    forceFormula: true,
    formula: "NF",
    max: 99,
    min: 1,
    terms: 5,

    pageCount: 1,
    hCount: 8,
    vCount: 10,
    byRows: 0,
    orientation: "p",
    fileFormat: "pdf",
    isAutoHeight: true,
    byPage: false,
    isGrow: false,
    isGrowByRows: false,
    withRight: false,
    design: true,
}

const MentalGenerator = () => {
    const [values, setValues] = useState<MentalDocumentValues>(
        Object.assign(initialValues, {})
    )

    const [fileURL, setFileURL] = useState<string>("")

    const generate = async () => {
        // ${process.env.NEXT_PUBLIC_BASE_URL}
        const requestURL = `expression/mental-generate?${Object.keys(values)
            .map((key) => {
                return `${key === "terms" ? "termLength" : key}=${values[key]}`
            })
            .join("&")}`

        try {
            const { data, status } = await axios.get(requestURL, {
                responseType: "blob",
            })

            console.log(status, { data })

            if (status === 200) {
                setFileURL(
                    URL.createObjectURL(
                        new Blob([data], { type: "application/pdf" })
                    )
                )
            }
        } catch (err) {
            handleAxiosError(err)
        }
    }

    const onFinish = () => {
        console.log(values)
        generate()
    }

    return (
        <DashboardLayout title="Генератор">
            <Layout
                hasSider
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <Sider width={300} className={styles.sider}>
                    <Form
                        name="basic"
                        initialValues={initialValues}
                        autoComplete="off"
                    >
                        <Typography
                            style={{
                                fontSize: 18,
                            }}
                        >
                            Настройки счёта
                        </Typography>

                        <Form.Item
                            label={"Кол.-во слагаемых (2-500)"}
                            name={"terms"}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginLeft: "15px",
                            }}
                        >
                            <InputNumber
                                min={2}
                                max={500}
                                value={values.terms}
                                onChange={(newValue: number) => {
                                    setValues({
                                        ...values,
                                        terms: newValue,
                                    })
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={"Формула"}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginLeft: "15px",
                            }}
                        >
                            <Dropdown
                                disabled={values.forceFormula}
                                trigger={["click"]}
                                overlay={
                                    <FormulaMenu
                                        value={values.formula}
                                        onChange={(formula) =>
                                            setValues({
                                                ...values,
                                                formula:
                                                    formula as CountFormula,
                                            })
                                        }
                                    />
                                }
                            >
                                <Button type={"text"}>
                                    {formulaName(values.formula)}
                                </Button>
                            </Dropdown>
                        </Form.Item>
                        <Form.Item
                            label={"Размер слагаемого"}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginLeft: "15px",
                            }}
                        >
                            <Dropdown
                                trigger={["click"]}
                                overlay={
                                    <DiapasonMenu
                                        value={`${values.min}-${values.max}`}
                                        onChange={(diapason) => {
                                            setValues({
                                                ...values,
                                                forceFormula:
                                                    diapason.includes(":"),
                                                formula: diapason.includes(":")
                                                    ? "NF"
                                                    : values.formula,
                                                min: parseInt(
                                                    diapason.includes(":")
                                                        ? diapason
                                                              .split(":")
                                                              .pop()
                                                              .split("-")[0]
                                                        : diapason.split("-")[0]
                                                ),
                                                max: parseInt(
                                                    diapason.includes(":")
                                                        ? diapason
                                                              .split(":")
                                                              .pop()
                                                              .split("-")[1]
                                                        : diapason.split("-")[1]
                                                ),
                                            })
                                        }}
                                    />
                                }
                            >
                                <Button type={"text"}>
                                    {values.forceFormula
                                        ? "Прямой счёт от 1 до 4"
                                        : `от ${values.min} до ${values.max}`}
                                </Button>
                            </Dropdown>
                        </Form.Item>
                    </Form>

                    <Typography
                        style={{
                            fontSize: 18,
                        }}
                    >
                        Настройки генератора
                    </Typography>

                    <Form.Item
                        label={"Кол.-во страниц (1-200)"}
                        name={"pageCount"}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "15px",
                        }}
                    >
                        <InputNumber
                            min={1}
                            max={200}
                            value={values.pageCount}
                            defaultValue={values.pageCount}
                            onChange={(newValue: number) => {
                                setValues({
                                    ...values,
                                    pageCount: newValue,
                                })
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={"Кол.-во столбиков (1-10)"}
                        name={"hCount"}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "15px",
                        }}
                    >
                        <InputNumber
                            min={1}
                            max={10}
                            value={values.pageCount}
                            defaultValue={values.pageCount}
                            onChange={(newValue: number) => {
                                setValues({
                                    ...values,
                                    hCount: newValue,
                                })
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={"Кол.-во строк на странице (1-10)"}
                        name={"vCount"}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "15px",
                        }}
                    >
                        <InputNumber
                            min={1}
                            max={10}
                            value={values.pageCount}
                            defaultValue={values.pageCount}
                            onChange={(newValue: number) => {
                                setValues({
                                    ...values,
                                    vCount: newValue,
                                })
                            }}
                        />
                    </Form.Item>

                    <Checkbox
                        style={{
                            marginLeft: "15px",
                        }}
                        value={values.isAutoHeight}
                        onChange={(e) => {
                            console.log(e.target.checked)
                            setValues({
                                ...values,
                                isAutoHeight: e.target.checked,
                            })
                        }}
                    >
                        Рассчитать всё автоматически
                    </Checkbox>

                    <Form.Item
                        label={"Ориентация"}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "15px",
                            marginTop: "15px",
                        }}
                    >
                        <Dropdown
                            // disabled={values.}
                            trigger={["click"]}
                            overlay={
                                <Menu
                                    selectable
                                    defaultSelectedKeys={[values.orientation]}
                                    onClick={({ key }) =>
                                        setValues({
                                            ...values,
                                            orientation: key as "p" | "l",
                                        })
                                    }
                                    items={[
                                        {
                                            key: "p",
                                            label: "Портрет",
                                        },
                                        {
                                            key: "l",
                                            label: "Альбомная",
                                        },
                                    ]}
                                />
                            }
                        >
                            <Button type={"text"}>
                                {values.orientation === "p"
                                    ? "Портрет"
                                    : "Альбомная"}
                            </Button>
                        </Dropdown>
                    </Form.Item>

                    <Form.Item
                        label={"Дизайн"}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "15px",
                            marginTop: "15px",
                        }}
                    >
                        <Dropdown
                            // disabled={values.}
                            trigger={["click"]}
                            overlay={
                                <Menu
                                    selectable
                                    defaultSelectedKeys={[
                                        values.design ? "book" : "simple",
                                    ]}
                                    onClick={({ key }) =>
                                        setValues({
                                            ...values,
                                            design: key === "book",
                                        })
                                    }
                                    items={[
                                        {
                                            key: "simple",
                                            label: "Простой",
                                        },
                                        {
                                            key: "book",
                                            label: "Для учебников",
                                        },
                                    ]}
                                />
                            }
                        >
                            <Button type={"text"}>
                                {values.design ? "Для учебников" : "Простой"}
                            </Button>
                        </Dropdown>
                    </Form.Item>

                    <Button
                        style={{
                            marginLeft: "15px",
                        }}
                        type="primary"
                        onClick={onFinish}
                    >
                        Сгенерировать
                    </Button>
                </Sider>
                <Content>
                    <PDFViewer fileURL={fileURL}></PDFViewer>
                </Content>
            </Layout>
        </DashboardLayout>
    )
}

export default MentalGenerator
