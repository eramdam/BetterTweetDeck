import './muteNfts.css';

import {sendInternalBTDMessage} from '../helpers/communicationHelpers';
import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/btdMessageTypes';

export const muteNftAvatars = makeBTDModule(({TD, jq, settings}) => {
  if (!settings.hideNftMuteNotice && !settings.muteNftAvatars) {
    modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (string) => {
      return string
        .replace(
          'js-tweet tweet',
          'js-tweet tweet {{#getMainUser}}{{#hasNftAvatar}} nft-avatar-notice {{/hasNftAvatar}} {{/getMainUser}}'
        )
        .replace(
          '{{#isRetweetedStatus}}',
          '{{#getMainUser}}{{#hasNftAvatar}} <p class="txt-mute nft-avatar-notice-content">Better TweetDeck masked this tweet <button class="btn-on-dark"> <span class="label">Why?</span> </button></p> {{/hasNftAvatar}}{{/getMainUser}} {{#isRetweetedStatus}}'
        );
    });

    jq(document).on('click', '.anti-nft-modal', (e) => {
      if (isHTMLElement(e.target) && e.target.closest('.js-modal-inner')) {
        return;
      }

      jq('.js-modals-container').html('');
    });

    jq(document).on('click', '.nft-mute', () => {
      sendInternalBTDMessage({
        name: BTDMessages.UPDATE_SETTINGS,
        origin: BTDMessageOriginsEnum.INJECT,
        payload: {
          muteNftAvatars: true,
          hideNftMuteNotice: true,
        },
        isReponse: false,
      });
      jq('.js-modals-container').html('');

      const nftFilters = TD.controller.filterManager
        .getAll()
        .filter((f) => f.type === 'BTD_nft_avatar');
      if (nftFilters.length < 1) {
        TD.controller.filterManager.addFilter('BTD_nft_avatar', '');
      }
    });

    jq(document).on('click', '.nft-show', () => {
      sendInternalBTDMessage({
        name: BTDMessages.UPDATE_SETTINGS,
        origin: BTDMessageOriginsEnum.INJECT,
        payload: {
          muteNftAvatars: false,
          hideNftMuteNotice: true,
        },
        isReponse: false,
      });
      jq('.js-modals-container').html('');
    });

    jq(document).on('click', '.nft-avatar-notice-content button', () => {
      jq('.js-modals-container').html(`
      <div class="js-modal-context overlay overlay-super scroll-v bg-color-overlay anti-nft-modal">
      <div class="js-modal-inner mdl margin-v--20 s-fluid mdl-lighter-on-dark">
        <div class="js-modal-content modal-content position-rel">
          <div class="padding-b--10 txt-size--16 width--600">
            <h1 class="padding-v--20 txt-size--24 width--430 padding-b--20 margin-a-auto txt-bold">
              Better TweetDeck stands against NFTs and cryptocurrency.
            </h1>
            <div class="color-twitter-darker-gray txt-size--15 width--430 margin-a-auto">
              <p>
                This user chose to <a href="https://twitter.com/TheSmarmyBum/status/1443259893411049475" target="_blank">connect their NFT wallet</a> to their profile, so Better TweetDeck hid their tweet.
                <br /> <br />
                I am standing up against NFTs and their dangerous rise in popularity.
                <br /><br />
                Why is that? Because I firmly believe that NFTs are dangerous for a few reasons
              </p>
              <ol>
                <li>They are bad for the environment, as they rely on cryptocurrencies that cause huge amounts of carbon emissions.</li>
                <li>They are only valuable as tools for money laundering, tax evasion, and greater fool investment fraud.</li>
                <li>Their structure facilitates art theft despite being touted as a way to "empower artists"</li>
              </ol>

              <p>
                This is why I am using my platform to spread awareness about the dangers of this technology.
                <br /><br />
                If you think that "actually, NFTs are good," it's okay. You're free to uninstall Better TweetDeck.
                <br /><br />

                Otherwise, the two options below are available to you:
              </p>

              <div class="nft-choices">
                <button class="Button Button--primary nft-mute">Mute users who use NFT avatars</button>
                <button class="Button Button--link nft-show">Keep showing NFT users</button>
              </div>

              <p>Sources:</p>
              <ol>
                <li><a href="https://antsstyle.medium.com/why-nfts-are-bad-the-long-version-2c16dae145e2" target="_blank">Why NFTs are bad: the long version</a></li>
                <li><a href="https://earth.org/nfts-environmental-impact/">What Are NFTs, And What is Their Environmental Impact?</a></li>
                <li><a href="https://twitter.com/NFTtheft">Account documenting art thefts happening in the NFT space</a></li>
                <li><a href="https://twitter.com/smdiehl/status/1445795667826208770">https://twitter.com/smdiehl/status/1445795667826208770</a></li>
              </ol>

            </div>
          </div>
        </div>
      </div>
    </div>
      `);
    });
  }

  jq(document).on('TD.ready', () => {
    const nftFilters = TD.controller.filterManager
      .getAll()
      .filter((f) => f.type === 'BTD_nft_avatar');

    if (settings.muteNftAvatars) {
      if (nftFilters.length < 1) {
        TD.controller.filterManager.addFilter('BTD_nft_avatar', '');
      }
    } else {
      nftFilters.forEach((filter) => {
        TD.controller.filterManager.removeFilter(filter);
      });
    }
  });
});
