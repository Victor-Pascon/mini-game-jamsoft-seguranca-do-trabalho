/**
 * Collision - detecção e resolução de colisões em eixos separados.
 * A movimentação é frame-rate independente e usa o tileSize do mapa.
 */
export class Collision {
  static checkRect(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  static checkMapCollision(entity, map) {
    if (!map || !map.collisionTiles) return false;

    const bounds = entity.getBounds();
    const tileSize = map.tileSize || 32;

    const startX = Math.floor(bounds.x / tileSize);
    const endX = Math.floor((bounds.x + bounds.width - 1) / tileSize);
    const startY = Math.floor(bounds.y / tileSize);
    const endY = Math.floor((bounds.y + bounds.height - 1) / tileSize);

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
          return true;
        }

        const tileIndex = map.tiles[y * map.width + x];
        if (map.collisionTiles.includes(tileIndex)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Empurra a entidade para fora do tile sólido mais próximo.
   * Usado como fallback após a movimentação por eixos.
   */
  static resolveMapCollision(entity, map) {
    if (!map || !map.collisionTiles) return;

    const tileSize = map.tileSize || 32;

    for (let iteration = 0; iteration < 4; iteration++) {
      if (!this.checkMapCollision(entity, map)) return;

      const bounds = entity.getBounds();
      const startX = Math.floor(bounds.x / tileSize);
      const endX = Math.floor((bounds.x + bounds.width - 1) / tileSize);
      const startY = Math.floor(bounds.y / tileSize);
      const endY = Math.floor((bounds.y + bounds.height - 1) / tileSize);

      let best = null;

      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          if (x < 0 || x >= map.width || y < 0 || y >= map.height) continue;

          const tileIndex = map.tiles[y * map.width + x];
          if (!map.collisionTiles.includes(tileIndex)) continue;

          const tileX = x * tileSize;
          const tileY = y * tileSize;

          const overlapLeft = (bounds.x + bounds.width) - tileX;
          const overlapRight = (tileX + tileSize) - bounds.x;
          const overlapTop = (bounds.y + bounds.height) - tileY;
          const overlapBottom = (tileY + tileSize) - bounds.y;

          const minOverlapX = Math.min(overlapLeft, overlapRight);
          const minOverlapY = Math.min(overlapTop, overlapBottom);

          let candidate;
          if (minOverlapX < minOverlapY) {
            candidate = {
              dx: overlapLeft < overlapRight ? -minOverlapX : minOverlapX,
              dy: 0,
              amount: minOverlapX
            };
          } else {
            candidate = {
              dx: 0,
              dy: overlapTop < overlapBottom ? -minOverlapY : minOverlapY,
              amount: minOverlapY
            };
          }

          if (!best || candidate.amount < best.amount) {
            best = candidate;
          }
        }
      }

      if (!best) return;
      entity.x += best.dx;
      entity.y += best.dy;
    }
  }

  static checkEntityCollision(entity1, entity2) {
    return this.checkRect(entity1.getBounds(), entity2.getBounds());
  }

  /**
   * Resolve a sobreposição entre o jogador e um NPC, empurrando pelo eixo
   * de menor penetração. Evita que o jogador fique preso no NPC.
   */
  static resolveEntityOverlap(entity, obstacle) {
    const a = entity.getBounds();
    const b = obstacle.getBounds();
    if (!this.checkRect(a, b)) return false;

    const overlapX = Math.min(a.x + a.width - b.x, b.x + b.width - a.x);
    const overlapY = Math.min(a.y + a.height - b.y, b.y + b.height - a.y);

    if (overlapX < overlapY) {
      const entityCenter = a.x + a.width / 2;
      const obstacleCenter = b.x + b.width / 2;
      entity.x += entityCenter < obstacleCenter ? -overlapX : overlapX;
    } else {
      const entityCenter = a.y + a.height / 2;
      const obstacleCenter = b.y + b.height / 2;
      entity.y += entityCenter < obstacleCenter ? -overlapY : overlapY;
    }

    return true;
  }
}
