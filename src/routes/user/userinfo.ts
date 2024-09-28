import { Router, Request, Response } from "express";
import {
  fetchInstagramData,
  extractMetaDescription,
  parseMetaDescription,
  fetchAvatarData,
} from "../../utils/instagram";

const router = Router();

router.get("/:username", async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const data = await fetchInstagramData(username);
    const { $, avatarUrl, avatarBase64 } = await fetchAvatarData(data);

    const metaDescription = extractMetaDescription($);

    if (!metaDescription) {
      return res.status(404).json({ error: "Meta description não encontrada" });
    }

    const { followers, following, posts, name, handle, bio } =
      parseMetaDescription(metaDescription);
    res.json({
      username: handle,
      name,
      followers,
      following,
      posts,
      bio,
      avatar: {
        url: avatarUrl,
        base64: avatarBase64
          ? `data:image/jpeg;base64,${avatarBase64}`
          : "Erro ao obter avatar",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
