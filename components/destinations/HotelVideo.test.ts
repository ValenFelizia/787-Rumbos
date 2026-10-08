import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldShowHotelVideo } from "./HotelVideo";

describe("shouldShowHotelVideo", () => {
  it("renders nothing without video (no file URL)", () => {
    assert.equal(shouldShowHotelVideo({}), false);
    assert.equal(shouldShowHotelVideo({ videoUrl: null }), false);
    assert.equal(shouldShowHotelVideo({ videoUrl: undefined }), false);
    assert.equal(shouldShowHotelVideo({ videoUrl: "" }), false);
    assert.equal(shouldShowHotelVideo({ videoUrl: "   " }), false);
  });

  it("allows render when a video file URL exists", () => {
    assert.equal(
      shouldShowHotelVideo({ videoUrl: "https://example.com/clip.mp4" }),
      true,
    );
  });
});
