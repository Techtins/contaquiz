import { ListParams } from "./IDefault"

export interface Topic {
    _id: string
    name: string
    disciplineId: string
    active: boolean
    parentTopicId?: string
    createdAt: string
    updatedAt: string
}

export interface TopicFormData {
    name: string
    active: boolean
    disciplineId: string
    parentTopicId?: string
}

export interface TopicListParams extends ListParams {
    disciplineId?: string;
}