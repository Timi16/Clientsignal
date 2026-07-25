import { Injectable } from '@nestjs/common';

export interface RenderedTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class TemplateService {
  render(
    htmlBody: string | null,
    textBody: string | null,
    subject: string,
    variables: Record<string, string>,
  ): RenderedTemplate {
    return {
      subject: this.replaceVariables(subject, variables),
      html: this.replaceVariables(htmlBody ?? '', variables),
      text: this.replaceVariables(textBody ?? '', variables),
    };
  }

  private replaceVariables(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
      return variables[key] ?? match;
    });
  }
}
