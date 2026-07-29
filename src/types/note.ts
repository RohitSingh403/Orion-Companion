export interface NoteAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded file data
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedTaskId: string | null;
  attachments: NoteAttachment[];
  createdAt: string;
  updatedAt: string;
}
