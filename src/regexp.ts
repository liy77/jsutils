export const AstralRange = "\\ud800-\\udfff";
export const ComboMarksRange = "\\u0300-\\u036f";
export const reComboHalfMarksRange = "\\ufe20-\\ufe2f";
export const ComboSymbolsRange = "\\u20d0-\\u20ff";
export const ComboMarksExtendedRange = "\\u1ab0-\\u1aff";
export const ComboMarksSupplementRange = "\\u1dc0-\\u1dff";
export const ComboRange = ComboMarksRange + reComboHalfMarksRange + ComboSymbolsRange + ComboMarksExtendedRange + ComboMarksSupplementRange;
export const DingbatRange = "\\u2700-\\u27bf";
export const LowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff";
export const MathOpRange = "\\xac\\xb1\\xd7\\xf7";
export const NonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf";
export const PunctuationRange = "\\u2000-\\u206f";
export const SpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
export const UpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde";
export const VarRange = "\\ufe0e\\ufe0f";
export const BreakRange = MathOpRange + NonCharRange + PunctuationRange + SpaceRange;

export const Apos = "['\u2019]";
export const Break = `[${BreakRange}]`;
export const Combo = `[${ComboRange}]`;
export const Digit = "\\d";
export const Dingbat = `[${DingbatRange}]`;
export const Lower = `[${LowerRange}]`;
export const Misc = `[^${AstralRange}${BreakRange + Digit + DingbatRange + LowerRange + UpperRange}]`;
export const Fitz = "\\ud83c[\\udffb-\\udfff]";
export const Modifier = `(?:${Combo}|${Fitz})`;
export const NonAstral = `[^${AstralRange}]`;
export const Regional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
export const SurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
export const Upper = `[${UpperRange}]`;
export const ZWJ = "\\u200d";

export const MiscLower = `(?:${Lower}|${Misc})`;
export const MiscUpper = `(?:${Upper}|${Misc})`;
export const OptContrLower = `(?:${Apos}(?:d|ll|m|re|s|t|ve))?`;
export const OptContrUpper = `(?:${Apos}(?:D|LL|M|RE|S|T|VE))?`;
export const reOptMod = `${Modifier}?`;
export const OptVar = `[${VarRange}]?`;
export const OptJoin = `(?:${ZWJ}(?:${[NonAstral, Regional, SurrPair].join("|")})${OptVar + reOptMod})*`;
export const OrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])";
export const OrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])";
export const Seq = OptVar + reOptMod + OptJoin;
export const Emoji = `(?:${[Dingbat, Regional, SurrPair].join("|")})${Seq}`;

export const reUnicodeWords = new RegExp([
    `${Upper}?${Lower}+${OptContrLower}(?=${[Break, Upper, "$"].join("|")})`,
    `${MiscUpper}+${OptContrUpper}(?=${[Break, Upper + MiscLower, "$"].join("|")})`,
    `${Upper}?${MiscLower}+${OptContrLower}`,
    `${Upper}+${OptContrUpper}`,
    OrdUpper,
    OrdLower,
    `${Digit}+`,
    Emoji
].join("|"), "g")
