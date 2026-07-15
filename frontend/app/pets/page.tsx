'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { petsApi, Pet, PetFormData } from '../../lib/api';
import Layout from '../../components/Layout';
import AuthGuard from '../../components/AuthGuard';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    gender: '',
    color: '',
    birthday: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response: any = await petsApi.getAll();
      setPets(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取宠物列表失败');
    }
  };

  const handleOpenModal = (pet?: Pet) => {
    if (pet) {
      setEditingPet(pet);
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed || '',
        age: String(pet.age),
        weight: String(pet.weight),
        gender: pet.gender,
        color: pet.color || '',
        birthday: pet.birthday || '',
        notes: pet.notes || '',
      });
    } else {
      setEditingPet(null);
      setFormData({
        name: '',
        species: '',
        breed: '',
        age: '',
        weight: '',
        gender: '',
        color: '',
        birthday: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPet(null);
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      weight: '',
      gender: '',
      color: '',
      birthday: '',
      notes: '',
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.species || !formData.age || !formData.weight || !formData.gender) {
      setError('请填写必填字段');
      return;
    }

    const age = parseFloat(formData.age);
    const weight = parseFloat(formData.weight);

    if (isNaN(age) || isNaN(weight)) {
      setError('年龄和体重必须是数字');
      return;
    }

    setLoading(true);

    try {
      if (editingPet) {
        await petsApi.update(editingPet.id, formData);
        setSuccess('更新成功');
      } else {
        await petsApi.create(formData);
        setSuccess('创建成功');
      }
      handleCloseModal();
      fetchPets();
    } catch (err: any) {
      setError(err.response?.data?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (petId: number) => {
    if (!confirm('确定要删除这个宠物吗？')) return;

    try {
      await petsApi.delete(petId);
      setSuccess('删除成功');
      fetchPets();
    } catch (err: any) {
      setError(err.response?.data?.message || '删除失败');
    }
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🐾 宠物档案管理</h2>
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary"
            >
              + 添加宠物
            </button>
          </div>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          {pets.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🐕</div>
              <h3>还没有宠物档案</h3>
              <p>点击上方按钮，为您的毛孩子创建档案吧~</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>种类</th>
                  <th>品种</th>
                  <th>年龄</th>
                  <th>体重(kg)</th>
                  <th>性别</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id}>
                    <td>{pet.name}</td>
                    <td>{pet.species}</td>
                    <td>{pet.breed || '-'}</td>
                    <td>{pet.age}岁</td>
                    <td>{pet.weight}</td>
                    <td>{pet.gender === 'male' ? '公' : '母'}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => handleOpenModal(pet)}
                          className="btn btn-outline btn-sm"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(pet.id)}
                          className="btn btn-danger btn-sm"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingPet ? '编辑宠物' : '添加宠物'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入宠物名称"
                required
              />
            </div>
            <div className="form-group">
              <label>种类 *</label>
              <input
                type="text"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                placeholder="如：dog、cat"
                required
              />
            </div>
            <div className="form-group">
              <label>品种</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="如：金毛"
              />
            </div>
            <div className="form-group">
              <label>年龄(岁) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="请输入年龄"
                required
              />
            </div>
            <div className="form-group">
              <label>体重(kg) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="请输入体重"
                required
              />
            </div>
            <div className="form-group">
              <label>性别 *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="">请选择性别</option>
                <option value="male">公</option>
                <option value="female">母</option>
              </select>
            </div>
            <div className="form-group">
              <label>颜色</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="如：黄色"
              />
            </div>
            <div className="form-group">
              <label>生日</label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>备注</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="其他备注信息"
                rows={3}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn btn-secondary flex-1"
              >
                取消
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? '处理中...' : '保存'}
              </button>
            </div>
          </form>
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
