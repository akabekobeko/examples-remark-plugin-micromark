export type Position = {
  line: number
  column: number
  offset: number
}

export type MdastNode = {
  type: string
  position: {
    start: Position
    end: Position
  }
  value: string | any
  children?: MdastNode[]
}

export type Parent = {
  children: any[]
}
