import { message } from "antd";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";

function handleFormError(errorInfo: ValidateErrorEntity) {
  try {
    errorInfo.errorFields.forEach(value => {
      message.error(value.errors[0]);
    });
  } catch (error: any) {
    const nonFormError: any = errorInfo;

    message.error(nonFormError?.message || error?.message || "Form has errors");
  }
}

export default handleFormError;
