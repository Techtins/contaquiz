export interface Discipline {
    _id: string
    name: string
    description?: string
    active: boolean
    createdAt: string
    updatedAt: string
}

export type DisciplineFormData = {
    name: string
    description: string
    active: boolean
}