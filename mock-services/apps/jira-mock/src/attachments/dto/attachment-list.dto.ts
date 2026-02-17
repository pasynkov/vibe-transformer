import { ApiProperty } from '@nestjs/swagger';
import { AttachmentDto } from '../../issues/dto/issue.dto';

export class AttachmentListDto {
  @ApiProperty({
    type: [AttachmentDto],
    description: 'List of attachments for the issue',
  })
  attachments: AttachmentDto[];
}
