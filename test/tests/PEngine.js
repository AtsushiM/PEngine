describe('PEは', function() {
    describe('Entityは', function() {
        it('new PE.Entity(width: num, height: num, restitution: num, position: {x, y}, velocity: {x, y}, acceleration: {x, y})で物体を作成する', function() {
            expect(new PE.Entity({
                width: 10,
                height: 10,
                restitution: 0.5,
                position: { x: 1, y: 1},
                velocity: { x: 1, y: 1},
                acceleration: { x: 1, y: 1}
            })).to.have.keys([
                'width',
                'height',
                'restitution',
                'x',
                'y', 
                'vx',
                'vy',
                'ax',
                'ay'
            ]);
        });

        it('entity.size({width, height})でサイズを変更する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 1, y: 1},
                    velocity: { x: 1, y: 1},
                    acceleration: { x: 1, y: 1}
                });

            entity.size({
                width: 20,
                height: 20
            });

            expect(entity.width).to.eql(20);
            expect(entity.height).to.eql(20);
        });

        it('entity.position({x, y})で位置を変更する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 1, y: 1},
                    velocity: { x: 1, y: 1},
                    acceleration: { x: 1, y: 1}
                });

            entity.position({
                x: 20,
                y: 20
            });

            expect(entity.x).to.eql(20);
            expect(entity.y).to.eql(20);
        });

        it('entity.velocity({x, y})で位置を変更する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 1, y: 1},
                    velocity: { x: 1, y: 1},
                    acceleration: { x: 1, y: 1}
                });

            entity.velocity({
                x: 20,
                y: 20
            });

            expect(entity.vx).to.eql(20);
            expect(entity.vy).to.eql(20);
        });

        it('entity.acceleration({x, y})で位置を変更する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 1, y: 1},
                    velocity: { x: 1, y: 1},
                    acceleration: { x: 1, y: 1}
                });

            entity.acceleration({
                x: 20,
                y: 20
            });

            expect(entity.ax).to.eql(20);
            expect(entity.ay).to.eql(20);
        });

        it('entity.getMidX()でentityの中心X座標を取得する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 0, y: 0},
                    velocity: { x: 0, y: 0},
                    acceleration: { x: 0, y: 0}
                });

            expect(entity.getMidX()).to.eql(5);
        });

        it('entity.getMidY()でentityの中心Y座標を取得する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 0, y: 0},
                    velocity: { x: 0, y: 0},
                    acceleration: { x: 0, y: 0}
                });

            expect(entity.getMidY()).to.eql(5);
        });

        it('entity.getTop()でentityの上辺Y座標を取得する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 0, y: 0},
                    velocity: { x: 0, y: 0},
                    acceleration: { x: 0, y: 0}
                });

            expect(entity.getTop()).to.eql(0);
        });

        it('entity.getLeft()でentityの左辺X座標を取得する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 0, y: 0},
                    velocity: { x: 0, y: 0},
                    acceleration: { x: 0, y: 0}
                });

            expect(entity.getLeft()).to.eql(0);
        });

        it('entity.getRight()でentityの右辺X座標を取得する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 0, y: 0},
                    velocity: { x: 0, y: 0},
                    acceleration: { x: 0, y: 0}
                });

            expect(entity.getRight()).to.eql(10);
        });

        it('entity.getBottom()でentityの下辺Y座標を取得する', function() {
            var entity = new PE.Entity({
                    width: 10,
                    height: 10,
                    restitution: 0.5,
                    position: { x: 0, y: 0},
                    velocity: { x: 0, y: 0},
                    acceleration: { x: 0, y: 0}
                });

            expect(entity.getBottom()).to.eql(10);
        });
    });

    it('new PE({gravity: {x, y}, sticky_threshold: num})で重力を考慮した物理演算を行う', function() {
        expect(new PE({
            gravity: {
                x: 0,
                y: 0
            },
            sticky_threshold: 0
        })).to.not.be.a('undefined');
    });
    it('pe.addEntity(entity)でentityに物理演算を適用する', function() {
        var pe = new PE({
                gravity: {
                    y: 0.000098
                }
            }),
            entity = new PE.Entity({
                width: 10,
                height: 10,
                x: 0,
                y: 0
            });

        pe.addEntity(entity);

        pe.step(100);

        expect(entity.y > 0).to.be.true;
    });
    it('pe.removeEntity(entity)でentityを物理演算対象から外す', function() {
        var pe = new PE({
                gravity: {
                    y: 0.000098
                }
            }),
            entity = new PE.Entity({
                width: 10,
                height: 10,
                x: 0,
                y: 0
            });

        pe.addEntity(entity);
        pe.removeEntity(entity);

        pe.step(100);

        expect(entity.y).to.equal(0);
    });
    it('pe.addCollision(entity)でentityに衝突判定を適用する', function(done) {
        var pe = new PE({
                gravity: {
                    y: 0.000098
                }
            }),
            entity = new PE.Entity({
                width: 10,
                height: 10,
                x: 0,
                y: 20
            }),
            id;

        pe.addEntity(entity);
        pe.addCollision(new PE.Entity({
            width: 10,
            height: 10,
            x: 0,
            y: 0
        }));

        entity.on('step', function(collision) {
            if (collision) {
                clearInterval(id);
                done();
            }
        });

        id = setInterval(function() {
            pe.step(20);
        }, 20);
    });
    it('pe.removeCollision(entity)でentityを衝突判定から外す', function(done) {
        var pe = new PE({
                gravity: {
                    y: 0.000098
                }
            }),
            entity = new PE.Entity({
                width: 10,
                height: 10,
                x: 0,
                y: 0
            }),
            collied = new PE.Entity({
                width: 10,
                height: 10,
                x: 0,
                y: 20
            }),
            id;

        pe.addEntity(entity);
        pe.addCollision(collied);
        pe.removeCollision(collied);

        entity.on('step', function(collision) {
            if (collision) {
                throw new Error('collision');
            }
        });

        id = setInterval(function() {
            pe.step(20);
        }, 20);

        setTimeout(function() {
            clearInterval(id);
            done();
        }, 500);
    });
    it('pe.getGravity()で重力を取得する', function() {
        var pe = new PE({
                gravity: {
                    x: 1,
                    y: 0.000098
                }
            });

        expect(pe.getGravity()).to.eql({
            x: 1,
            y: 0.000098
        });
    });
    it('pe.setGravity({x, y})で重力を設定する', function() {
        var pe = new PE({
                gravity: {
                    x: 1,
                    y: 0.000098
                }
            });

        pe.setGravity({
            x: 1,
            y: 1
        });

        expect(pe.getGravity()).to.eql({
            x: 1,
            y: 1
        });
    });
    it('pe.getEntities()で物理演算対象を取得する', function() {
        var pe = new PE();

        pe.addEntity(new PE.Entity);
        pe.addEntity(new PE.Entity);
        pe.addEntity(new PE.Entity);

        expect(pe.getEntities()).to.be.a('array');
        expect(pe.getEntities().length).to.eql(3);
    });
    it('pe.getCollidables()で衝突判定対象を取得する', function() {
        var pe = new PE();

        pe.addCollision(new PE.Entity);
        pe.addCollision(new PE.Entity);
        pe.addCollision(new PE.Entity);

        expect(pe.getCollidables()).to.be.a('array');
        expect(pe.getCollidables().length).to.eql(3);
    });
    it('pe.getEntitiesAndCollidables()で物理演算対象と衝突判定対象を取得する', function() {
        var pe = new PE();

        pe.addEntity(new PE.Entity);
        pe.addEntity(new PE.Entity);
        pe.addEntity(new PE.Entity);
        pe.addCollision(new PE.Entity);
        pe.addCollision(new PE.Entity);
        pe.addCollision(new PE.Entity);

        expect(pe.getEntitiesAndCollidables()).to.be.a('array');
        expect(pe.getEntitiesAndCollidables().length).to.eql(6);
    });
    it('pe.step()で物理演算を行う', function() {
    });
});
