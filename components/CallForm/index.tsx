import { Button, DatePicker, Form, Input, Select } from "antd"
import { Rule } from "antd/lib/form"
import moment from "moment"
import MemberSelect from "components/MemberSelect"
import { useAppDispatch, useAppSelector } from "slices"
import { createScheduleAction } from "slices/schedule"
import { selectAuth } from "slices/auth"
import { ValidateErrorEntity } from "rc-field-form/lib/interface"
import handleFormError from "utils/handleFormError"

const { Item } = Form

interface CallFormValues {
    name: string
    description: string
    visibility: "PRIVATE" | "PUBLIC"
    date: moment.Moment
    members: string[]
}

const initialValues: CallFormValues = {
    name: "",
    description: "",
    visibility: "PRIVATE",
    members: [],
    date: moment().add(1, "hour").set("minute", 0),
}

const requiredRule: Rule = {
    required: true,
    message: "Это поле обязательно!",
}

const CallForm: React.FC = () => {
    // destruct user from auth slice with useAppSelector
    const { user } = useAppSelector(selectAuth)

    // get dispatch from useAppDispatch
    const dispatch = useAppDispatch()

    // destruct loading from schedule slice with useAppSelector
    const { updating: loading } = useAppSelector((state) => state.schedule)

    const onFinish = (values: CallFormValues) => {
        dispatch(
            createScheduleAction({
                date: values.date.toISOString(),
                name: values.name,
                description: values.description,
                visibility: values.visibility,
                members: values.members,
                organizerId: user._id || "",
            })
        )
    }

    const onFinishFailed = (errorInfo: ValidateErrorEntity<CallFormValues>) => {
        handleFormError(errorInfo)
    }

    return (
        <Form
            name={"createConferenceForm"}
            layout={"vertical"}
            initialValues={initialValues as CallFormValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            wrapperCol={{ span: 10 }}
        >
            <Item name={"name"} label={"Название"} rules={[requiredRule]}>
                <Input placeholder="Название конференции" />
            </Item>

            <Item
                name={"description"}
                label={"Описание"}
                rules={[requiredRule]}
            >
                <Input.TextArea placeholder="Описание конференции" showCount maxLength={512} />
            </Item>

            <Item
                name={"date"}
                label={"Дата проведения"}
                rules={[requiredRule]}
            >
                <DatePicker
                    placeholder="Выберите дату"
                    format={"DD/MM/YYYY HH:mm"}
                    showTime
                />
            </Item>

            <Item
                name={"visibility"}
                label={"Кто может присоединиться"}
                rules={[requiredRule]}
            >
                <Select>
                    <Select.Option value={"PUBLIC"}>Все</Select.Option>
                    <Select.Option value={"PRIVATE"}>
                        Только мои участники
                    </Select.Option>
                </Select>
            </Item>

            <Item name={"members"} label={"Пригласить участников"}>
                <MemberSelect />
            </Item>

            <Item>
                <Button type={"primary"} htmlType={"submit"} loading={loading}>
                    Создать конференцию
                </Button>
            </Item>
        </Form>
    )
}

export default CallForm
