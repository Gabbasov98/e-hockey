$(document).ready(() => {
    TRNMNT_helpers.comment('#newsCommentForm', NEWS_COMMENT);
    TRNMNT_helpers.like('#newsLikeButton', NEWS_LIKE);
    TRNMNT_helpers.like('.comment-like svg use', NEWS_COMMENT);
});
