package com.katasphere.tag;

import java.util.UUID;

public record TagDto(
    UUID id,
    String name,
    String slug
) {
    public static TagDto fromEntity(Tag tag) {
        return new TagDto(tag.getId(), tag.getName(), tag.getSlug());
    }
}
