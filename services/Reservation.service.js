class ReservationService {
    static _reservationServiceInstance = null;

    static getInstance() {
        if (ReservationService._reservationServiceInstance === null) {
            ReservationService._reservationServiceInstance = new ReservationService();
        }
        return ReservationService._reservationServiceInstance;
    }

    async getAll() {}

    async getOne() {}

    async create() {}

    async update() {}

    async delete() {}
}

module.exports = ReservationService;
