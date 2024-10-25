import { z } from 'zod'

export const EditUserProfileSchema = z.object({
  email: z.string().email('Required'),
  name: z.string().min(1, 'Required'),
})

export const WorkflowFormSchema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
})

export const ConnectionTypes = ['Google Drive', 'Notion', 'Slack', 'Discord']

export const Connection = {
  title: '',
  description: '',
  image: '',
  connectionKey: '',
  accessTokenKey: undefined,
  alwaysTrue: undefined,
  slackSpecial: undefined
}

export const EditorCanvasTypes = [
  'Email',
  'Condition',
  'AI',
  'Slack',
  'Google Drive',
  'Notion',
  'Custom Webhook',
  'Google Calendar',
  'Trigger',
  'Action',
  'Wait'
]

export const EditorCanvasCardType = {
  title: '',
  description: '',
  completed: false,
  current: false,
  metadata: {},
  type: ''
}

export const EditorNodeType = {
  id: '',
  type: '',
  position: {
    x: 0,
    y: 0,
  },
  data: EditorCanvasCardType
}

export const EditorNode = EditorNodeType

export const EditorActions = [
  {
    type: 'LOAD_DATA',
    payload: {
      elements: [],
      edges: [
        {
          id: '',
          source: '',
          target: '',
        },
      ],
    },
  },
  {
    type: 'UPDATE_NODE',
    payload: {
      elements: [],
    },
  },
  { type: 'REDO' },
  { type: 'UNDO' },
  {
    type: 'SELECTED_ELEMENT',
    payload: {
      element: EditorNode,
    },
  },
]

export const nodeMapper = {
  Notion: 'notionNode',
  Slack: 'slackNode',
  Discord: 'discordNode',
  'Google Drive': 'googleNode',
}
