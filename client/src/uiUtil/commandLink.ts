import { button, HValues } from "domeleon"

export const commandLink = (...values: HValues[]) =>
  button(
    {
      type: "button",
      class: "bg-transparent border-none appearance-none cursor-pointer"
    },
    ...values
  )