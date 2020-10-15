import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IamAuthenticator } from 'ibm-watson/auth';
import { ConfigService } from '../../config/config.service';
import { ConfigEnum } from '../../config/config.keys';
import LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');


@Injectable()
export class TranslateService {
  private translator;

  constructor(private _config: ConfigService) {
    this.translator = new LanguageTranslatorV3({
      version: '2018-05-01',
      authenticator: new IamAuthenticator({
        apikey: _config.get(ConfigEnum.API_IBM_TRANSLATOR),
      }),
      serviceUrl: _config.get(ConfigEnum.API_URL_IBM_TRANSLATOR),
    });
  }

  async translate(text: string, language= 'en-es'): Promise<void> {
    if (!text) {
      throw new InternalServerErrorException('Bad implementation');
    }

    const textTranslated = await this.translator.translate({
      text: text,
      modelId: language,
    });

    console.log(textTranslated);
  }
}
