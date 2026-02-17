import { Injectable, NotFoundException } from '@nestjs/common';
import { CSV_FILES } from './data/csv-data';

@Injectable()
export class AttachmentsService {
  /**
   * Get attachment file content
   */
  getAttachmentFile(attachmentId: string): { content: string; filename: string } {
    const file = CSV_FILES[attachmentId];

    if (!file) {
      throw new NotFoundException(`Attachment with id ${attachmentId} not found`);
    }

    return {
      content: file.content,
      filename: file.filename,
    };
  }

  /**
   * Check if attachment exists
   */
  attachmentExists(attachmentId: string): boolean {
    return attachmentId in CSV_FILES;
  }
}
